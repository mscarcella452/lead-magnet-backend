import "server-only";
import { prisma } from "@/lib/db";
import { LeadRelations } from "@/types/lead";

export async function getLeadRelations(
  leadId: string,
): Promise<LeadRelations | null> {
  console.log(
    "🔍 DB QUERY: Fetching lead relations for:",
    leadId,
    new Date().toISOString(),
  );
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      notes: {
        orderBy: [
          { pinnedAt: "desc" }, // pinned notes at top
          { createdAt: "asc" }, // unpinned notes in original chronological order
        ],
      },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });
  return lead;
}
