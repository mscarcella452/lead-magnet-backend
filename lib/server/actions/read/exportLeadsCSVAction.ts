"use server";
import { exportLeadCSV } from "@/lib/server/read/exportLeadsCSV";
import { ActionResult } from "@/types/server";

// ============================================================================
// exportLeadCSVAction(leadIds?: string[]): Promise<ActionResult<string>>
// Server action to export leads as CSV
// Optional leadIds parameter for exporting selected leads only
// ============================================================================

export async function exportLeadCSVAction(
  leadIds?: string[],
): Promise<ActionResult<string>> {
  try {
    const csv = await exportLeadCSV(leadIds);
    return { success: true, data: csv };
  } catch (error) {
    console.error("Error exporting leads to CSV:", error);
    return { success: false, error: "Failed to export leads" };
  }
}
