"use server";
import { getLeadRelations } from "@/lib/server/read/getLeadRelations";
import { ActionResult } from "@/types/server";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";
import { LeadRelations } from "@/types/lead";

export async function getLeadRelationsAction(
  leadId: string,
): Promise<ActionResult<LeadRelations>> {
  try {
    // Create a cached version of the query
    const cachedGetRelations = unstable_cache(
      async () => getLeadRelations(leadId),
      [CACHE_TAGS.LEADS, leadId],
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LEADS],
      },
    );

    const relations = await cachedGetRelations();

    if (!relations) {
      return { success: false, error: "Lead relations not found" };
    }

    return { success: true, data: relations };
  } catch (error) {
    console.error("Error fetching lead relations:", error);
    return { success: false, error: "Failed to fetch lead relations" };
  }
}
