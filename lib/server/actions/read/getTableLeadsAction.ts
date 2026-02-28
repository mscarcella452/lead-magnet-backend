"use server";
import { LeadTableRow } from "@/types/lead";
import { getTableLeads, type GetTableLeadsOptions } from "@/lib/server/read/getTableLeads";
import { ActionResult } from "@/types/server";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";

// Cache the total count separately (changes less frequently)
async function getCachedLeadsCount() {
  const cachedCount = unstable_cache(
    async () => {
      const { prisma } = await import("@/lib/db");
      return prisma.lead.count();
    },
    [CACHE_TAGS.LEADS, "count"],
    {
      revalidate: 300, // 5 minutes - count changes less often
      tags: [CACHE_TAGS.LEADS],
    },
  );
  return cachedCount();
}

export async function getTableLeadsAction(
  options?: GetTableLeadsOptions,
): Promise<ActionResult<{ leads: LeadTableRow[]; total: number }>> {
  try {
    // Create a cached version of the query
    const cachedGetTableLeads = unstable_cache(
      async () => getTableLeads(options),
      [CACHE_TAGS.LEADS, "table", JSON.stringify(options ?? {})],
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LEADS],
      },
    );

    // Fetch leads and total count in parallel
    const [leads, total] = await Promise.all([
      cachedGetTableLeads(),
      getCachedLeadsCount(),
    ]);

    return { success: true, data: { leads, total } };
  } catch (error) {
    console.error("Error fetching table leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}
