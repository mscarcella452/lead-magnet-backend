import "server-only";
import { Lead, LeadPriority, ActivityType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPriorityChange } from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";

// ============================================================
// Types
// ============================================================

export interface UpdateLeadPriorityData {
  leadId: string;
  newPriority: LeadPriority;
}

// ============================================================
// updateLeadPriority
// ============================================================

/**
 * Updates a lead's priority and logs activity as a side effect.
 * No-ops if the priority hasn't changed.
 * Requires an authenticated user — performedBy is derived from session.
 */
export async function updateLeadPriority(
  data: UpdateLeadPriorityData,
): Promise<Lead> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const currentLead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { id: true, priority: true },
  });
  if (!currentLead) throw new Error("Lead not found.");

  if (currentLead.priority === data.newPriority) {
    return prisma.lead.findUniqueOrThrow({ where: { id: data.leadId } });
  }

  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({
      where: { id: data.leadId },
      data: { priority: data.newPriority },
    }),
    prisma.activity.create({
      data: {
        leadId: data.leadId,
        type: ActivityType.PRIORITY_CHANGED,
        performedBy: currentUser.username,
        metadata: formatPriorityChange(currentLead.priority, data.newPriority),
      },
    }),
  ]);

  return updatedLead;
}
