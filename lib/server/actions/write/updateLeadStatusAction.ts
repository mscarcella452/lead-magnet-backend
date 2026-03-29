"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  updateLeadStatus,
  type UpdateLeadStatusData,
} from "@/lib/server/write/updateLeadStatus";
import { ActionResult } from "@/types/server";
import { Lead } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// Server action to update a lead's status
// Revalidates cache and dashboard
// ============================================================================

export async function updateLeadStatusAction(
  data: UpdateLeadStatusData,
): Promise<ActionResult<Lead>> {
  try {
    const lead = await updateLeadStatus(data);

    // Revalidate both cache and path
    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: lead };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
