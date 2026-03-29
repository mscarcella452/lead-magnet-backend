"use server";

import { LeadWithRelations } from "@/types/lead";
import { getLeadWithRelations } from "@/lib/server/read/getLeadWithRelations";
import { ActionResult } from "@/types/server";

// ============================================================================
// Actions
// ============================================================================

export async function getLeadWithRelationsAction(
  leadId: string,
): Promise<ActionResult<LeadWithRelations>> {
  try {
    const lead = await getLeadWithRelations(leadId);

    if (!lead) {
      return { success: false, error: "Lead not found." };
    }

    return { success: true, data: lead };
  } catch (error) {
    console.error("Error fetching lead:", error);
    return { success: false, error: "Failed to fetch lead." };
  }
}
