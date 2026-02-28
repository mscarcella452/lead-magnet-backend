"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { updateLead, type UpdateLeadData } from "@/lib/server/write/updateLead";
import { ActionResult } from "@/types/server";
import { Lead } from "@prisma/client";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// updateLeadAction(id: string, data: UpdateLeadData): Promise<ActionResult<Lead>>
// Server action to update a lead
// Revalidates cache and dashboard
// ============================================================================

export async function updateLeadAction(
  id: string,
  data: UpdateLeadData,
  editedBy?: string,
): Promise<ActionResult<Lead>> {
  try {
    const lead = await updateLead(id, data, editedBy);

    // Revalidate both cache and path
    revalidateTag(CACHE_TAGS.LEADS);
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: lead };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}
