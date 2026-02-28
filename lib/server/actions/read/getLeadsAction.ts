"use server";
import { Lead } from "@prisma/client";
import { getLeads, type GetLeadsOptions } from "@/lib/server/read/getLeads";
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

export async function getLeadsAction(
  options?: GetLeadsOptions,
): Promise<ActionResult<{ leads: Lead[]; total: number }>> {
  try {
    // Create a cached version of the query
    const cachedGetLeads = unstable_cache(
      async () => getLeads(options),
      [CACHE_TAGS.LEADS, JSON.stringify(options ?? {})],
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LEADS],
      },
    );

    // Fetch leads and total count in parallel
    const [leads, total] = await Promise.all([
      cachedGetLeads(),
      getCachedLeadsCount(),
    ]);

    return { success: true, data: { leads, total } };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}
