"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { generateLeadsCSV } from "@/lib/helpers/lead-csv";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
type ActivityType =
  | "NOTE_ADDED"
  | "STATUS_CHANGED"
  | "LEAD_CREATED"
  | "LEAD_UPDATED";

/**
 * Server Actions for Admin Operations
 *
 * These are INTERNAL ONLY - cannot be called from external websites.
 * They run on the server and are used by admin dashboard components.
 */

/**
 * Timeout wrapper for database operations
 * Fails fast (2s) instead of waiting for full Prisma timeout (30s)
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 2000,
): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(
      () => reject(new Error("Database connection timeout")),
      timeoutMs,
    ),
  );
  return Promise.race([promise, timeout]);
}

/**
 * Update lead data
 * @param id - Lead ID
 * @param data - Lead data to update
 * @returns Success status
 */
export async function updateLead(
  id: string,
  data: { name?: string; email?: string; source?: string; status?: LeadStatus },
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.lead.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.status && { status: data.status }),
      } as any,
    });

    // Revalidate the dashboard page to show updated data
    revalidatePath("/admin/dashboard");

    console.log("✅ Updated lead:", id);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating lead:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead",
    };
  }
}

/**
 * Get dashboard statistics
 * @returns Lead statistics
 */
export async function getDashboardStats() {
  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, today, thisWeek, thisMonth] = await withTimeout(
      Promise.all([
        prisma.lead.count(),
        prisma.lead.count({
          where: { createdAt: { gte: todayStart } },
        }),
        prisma.lead.count({
          where: { createdAt: { gte: weekStart } },
        }),
        prisma.lead.count({
          where: { createdAt: { gte: monthStart } },
        }),
      ]),
    );

    return { total, today, thisWeek, thisMonth };
  } catch (error) {
    console.error("❌ Error getting dashboard stats:", error);
    return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
  }
}

/**
 * Get all leads for dashboard
 * @returns Array of leads
 */
export async function getLeads() {
  try {
    const leads = await withTimeout(
      prisma.lead.findMany({
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
          },
          activities: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100, // Limit to most recent 100
      }),
    );

    return leads;
  } catch (error) {
    console.error("❌ Error getting leads:", error);
    return [];
  }
}
