"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  updateLeadPriority,
  type UpdateLeadPriorityData,
} from "@/lib/server/write/updateLeadPriority";
import { ActionResult } from "@/types/server";
import { Lead } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================
// Server action to update a lead's priority
// Revalidates cache and dashboard
// ============================================================

export async function updateLeadPriorityAction(
  data: UpdateLeadPriorityData,
): Promise<ActionResult<Lead>> {
  try {
    const lead = await updateLeadPriority(data);
    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);
    return { success: true, data: lead };
  } catch (error) {
    console.error("Error updating lead priority:", error);
    return { success: false, error: "Failed to update priority" };
  }
}
