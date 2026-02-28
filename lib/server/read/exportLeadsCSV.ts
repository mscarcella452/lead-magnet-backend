import "server-only";
import { prisma } from "@/lib/db";
import { generateLeadsCSV } from "@/lib/helpers/lead-csv";
import { Lead } from "@prisma/client";

// ============================================================================
// exportLeadCSV(leadIds?: string[]): Promise<string>
// Exports leads to CSV format
// If leadIds provided: exports only those leads
// If leadIds omitted: exports all leads
// ============================================================================

export async function exportLeadCSV(leadIds?: string[]): Promise<string> {
  let leads: Lead[];

  if (leadIds && leadIds.length > 0) {
    // Export selected leads
    leads = await prisma.lead.findMany({
      where: {
        id: { in: leadIds },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Export all leads
    leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return generateLeadsCSV(leads);
}
