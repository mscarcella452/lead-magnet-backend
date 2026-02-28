import { LeadRelations } from "@/types";

/**
 * In-memory cache for lead with relations.
 * Resets on page refresh, preventing stale data across sessions.
 */
export const leadWithRelationsCache = new Map<string, LeadRelations>();

/**
 * Invalidates the cache for a specific lead.
 * @param leadId The ID of the lead to invalidate.
 */
export const invalidateLeadWithRelationsCache = (leadId: string) => {
  leadWithRelationsCache.delete(leadId);
};
