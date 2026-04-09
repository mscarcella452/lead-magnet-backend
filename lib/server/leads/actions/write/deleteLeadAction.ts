"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { deleteLead } from "@/lib/server/leads/write/deleteLead";
import { ActionResult } from "@/types/server/actions";
import { CACHE_TAGS, REVALIDATE_PATHS } from "@/lib/server/constants";

// ============================================================================
// deleteLeadAction(leadIds: string[]): Promise<ActionResult<void>>
// Server action to delete a lead(s)
// ============================================================================

export async function deleteLeadAction(
  leadIds: string[],
): Promise<ActionResult<null>> {
  if (leadIds.length === 0) {
    return { success: false, error: "No leads selected" };
  }
  try {
    await deleteLead(leadIds);

    revalidateTag(CACHE_TAGS.LEADS, {});
    revalidatePath(REVALIDATE_PATHS.ADMIN_DASHBOARD);

    return { success: true, data: null };
  } catch (error: unknown) {
    const leadLength = leadIds.length === 1 ? "lead" : "leads";
    console.error("Error deleting lead:", error);
    return { success: false, error: `Failed to delete ${leadLength}` };
  }
}
