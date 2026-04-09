"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  bulkUpdateLeadPriority,
  type BulkUpdateLeadPriorityData,
} from "@/lib/server/leads/write/bulkUpdateLeadPriority";
import { ActionResult } from "@/types/server/actions";
import { Lead } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// bulkUpdateLeadPriorityAction(data: BulkUpdateLeadPriorityData): Promise<ActionResult<Lead[]>>
// Server action to bulk update lead priorities
// Revalidates cache and dashboard
// ============================================================================

export async function bulkUpdateLeadPriorityAction(
  data: BulkUpdateLeadPriorityData,
): Promise<ActionResult<Lead[]>> {
  try {
    const leads = await bulkUpdateLeadPriority(data);
    revalidateTag(CACHE_TAGS.LEADS, {});
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);
    return { success: true, data: leads };
  } catch (error) {
    console.error("Error bulk updating lead priority:", error);
    return { success: false, error: "Failed to bulk update lead priorities" };
  }
}
