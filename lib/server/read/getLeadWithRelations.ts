import "server-only";
import { prisma } from "@/lib/db";
import { LeadWithRelations } from "@/types/lead";

// lib/server/read/getLeadWithRelations.ts
export async function getLeadWithRelations(
  leadId: string,
): Promise<LeadWithRelations | null> {
  console.log(
    "🔍 DB QUERY: Fetching lead with relations for:",
    leadId,
    new Date().toISOString(),
  );
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      notes: {
        orderBy: [
          { pinnedAt: "desc" }, // pinned notes at top
          { createdAt: "desc" }, // unpinned notes in original chronological order
        ],
      },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  return lead;
}
