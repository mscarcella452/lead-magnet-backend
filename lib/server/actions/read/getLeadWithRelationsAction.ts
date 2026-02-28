"use server";
import { Lead } from "@prisma/client";
import { getLeadWithRelations } from "@/lib/server/read/getLeadWithRelations";
import { ActionResult } from "@/types/server";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/server/constants";
import { LeadWithRelations } from "@/types/lead";

export async function getLeadWithRelationsAction(
  leadId: string,
): Promise<ActionResult<LeadWithRelations>> {
  try {
    // Create a cached version of the query
    const cachedGetLeads = unstable_cache(
      async () => getLeadWithRelations(leadId),
      [CACHE_TAGS.LEADS, leadId],
      {
        revalidate: 60,
        tags: [CACHE_TAGS.LEADS],
      },
    );

    const lead = await cachedGetLeads();

    if (!lead) {
      return { success: false, error: "Lead not found" };
    }

    return { success: true, data: lead };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}
