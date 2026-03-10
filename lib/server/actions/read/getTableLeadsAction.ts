"use server";

import { LeadTableRow } from "@/types/lead";
import {
  getTableLeads,
  getTableLeadsCount,
  type GetTableLeadsOptions,
} from "@/lib/server/read/getTableLeads";
import { ActionResult } from "@/types/server";

// ============================================================================
// getTableLeadsAction
// ============================================================================

export async function getTableLeadsAction(
  options?: GetTableLeadsOptions,
): Promise<ActionResult<{ leads: LeadTableRow[]; total: number }>> {
  try {
    const [leads, total] = await Promise.all([
      getTableLeads(options),
      getTableLeadsCount(),
    ]);
    return { success: true, data: { leads, total } };
  } catch (error) {
    console.error("Error fetching table leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}
