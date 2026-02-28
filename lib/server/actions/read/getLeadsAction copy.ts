"use server";
import { Lead } from "@prisma/client";
import { getLeads, type GetLeadsOptions } from "@/lib/server/read/getLeads";
import { ActionResult } from "@/types/server";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";

export async function getLeadsAction(
  options?: GetLeadsOptions,
): Promise<ActionResult<Lead[]>> {
  try {
    // Create a cached version of the query
    const cachedGetLeads = unstable_cache(
      async () => getLeads(options),
      [CACHE_TAGS.LEADS, JSON.stringify(options ?? {})], // Automatically handles any option changes
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LEADS],
      },
    );

    const leads = await cachedGetLeads();
    return { success: true, data: leads };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}
