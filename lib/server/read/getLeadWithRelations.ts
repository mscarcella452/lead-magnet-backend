import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { LeadWithRelations } from "@/types/lead";
import { CACHE_TAGS } from "@/lib/server/constants";

// ============================================================================
// Internal fetch functions
// ============================================================================

async function fetchLeadWithRelations(
  leadId: string,
): Promise<LeadWithRelations | null> {
  console.log(
    "🔍 DB QUERY: Fetching lead with relations for:",
    leadId,
    new Date().toISOString(),
  );

  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      notes: {
        orderBy: [
          { pinnedAt: "desc" }, // pinned notes at top
          { createdAt: "desc" }, // unpinned notes in chronological order
        ],
      },
      activities: { orderBy: { createdAt: "desc" } },
      leadMagnet: true,
    },
  });
}

// ============================================================================
// Cached exports
// Cache revalidates every 60 seconds or when LEADS tag is invalidated.
// ============================================================================

export const getLeadWithRelations = (leadId: string) =>
  unstable_cache(fetchLeadWithRelations, [CACHE_TAGS.LEADS, "detail", leadId], {
    revalidate: 60,
    tags: [CACHE_TAGS.LEADS],
  })(leadId);
