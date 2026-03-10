"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  bulkUpdateLeadStatus,
  type BulkUpdateLeadStatusData,
} from "@/lib/server/write/bulkUpdateLeadStatus";
import { ActionResult } from "@/types/server";
import { Lead } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// bulkUpdateLeadStatusAction(data: BulkUpdateLeadStatusData): Promise<ActionResult<Lead[]>>
// Server action to bulk update lead statuses
// Revalidates cache and dashboard
// ============================================================================

export async function bulkUpdateLeadStatusAction(
  data: BulkUpdateLeadStatusData,
): Promise<ActionResult<Lead[]>> {
  try {
    const leads = await bulkUpdateLeadStatus(data);

    // Revalidate both cache and path
    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: leads };
  } catch (error) {
    console.error("Error bulk updating lead status:", error);
    return { success: false, error: "Failed to bulk update lead statuses" };
  }
}
