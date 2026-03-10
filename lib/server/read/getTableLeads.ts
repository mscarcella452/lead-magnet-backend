import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { LeadTableRow } from "@/types/lead";
import { CACHE_TAGS } from "@/lib/server/constants";

// ============================================================================
// Types
// ============================================================================

export type SortField =
  | "createdAt"
  | "displayId"
  | "displayName"
  | "status"
  | "source"
  | "priority"
  | "score"
  | "email"
  | "name";
export type SortOrder = "asc" | "desc";

export interface GetTableLeadsOptions {
  limit?: number;
  offset?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

// ============================================================================
// Internal fetch functions
// ============================================================================

async function fetchTableLeads(
  options?: GetTableLeadsOptions,
): Promise<LeadTableRow[]> {
  const sortBy = options?.sortBy ?? "createdAt";
  const sortOrder = options?.sortOrder ?? "desc";

  const fieldMap: Record<SortField, string> = {
    email: "email",
    name: "name",
    displayName: "name",
    displayId: "displayId",
    createdAt: "createdAt",
    status: "status",
    source: "source",
    priority: "priority",
    score: "score",
  };

  const orderBy: Prisma.LeadOrderByWithRelationInput = {
    [fieldMap[sortBy] || "createdAt"]: sortOrder,
  };

  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      displayId: true,
      name: true,
      email: true,
      status: true,
      priority: true,
      score: true,
      source: true,
      campaign: true,
      createdAt: true,
    },
    orderBy,
    take: options?.limit ?? 100,
    skip: options?.offset ?? 0,
  });

  return leads.map((lead) => ({
    id: lead.id,
    displayId: lead.displayId,
    displayName: lead.name || lead.displayId,
    email: lead.email,
    name: lead.name,
    status: lead.status,
    priority: lead.priority,
    score: lead.score ?? undefined,
    source: lead.source ?? undefined,
    campaign: lead.campaign ?? undefined,
    createdAt: lead.createdAt,
  }));
}

async function fetchLeadsCount(): Promise<number> {
  return prisma.lead.count();
}

// ============================================================================
// Cached exports
// Cache revalidates every 60 seconds or when LEADS tag is invalidated.
// ============================================================================

export const getTableLeads = unstable_cache(
  fetchTableLeads,
  [CACHE_TAGS.LEADS, "table"],
  { revalidate: 60, tags: [CACHE_TAGS.LEADS] },
);

export const getTableLeadsCount = unstable_cache(
  fetchLeadsCount,
  [CACHE_TAGS.LEADS, "count"],
  { revalidate: 300, tags: [CACHE_TAGS.LEADS] },
);
