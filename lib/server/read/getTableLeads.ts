import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { LeadTableRow } from "@/types/lead";

export type SortField = "createdAt" | "displayId" | "displayName" | "status" | "source" | "priority" | "score" | "email" | "name";
export type SortOrder = "asc" | "desc";

export interface GetTableLeadsOptions {
  limit?: number;
  offset?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export async function getTableLeads(options?: GetTableLeadsOptions): Promise<LeadTableRow[]> {
  const sortBy = options?.sortBy ?? "createdAt";
  const sortOrder = options?.sortOrder ?? "desc";

  // Map UI field names to database field names
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

  const dbField = fieldMap[sortBy] || "createdAt";
  const orderBy: Prisma.LeadOrderByWithRelationInput = {
    [dbField]: sortOrder,
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

  // Transform to LeadTableRow format
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

// pagination example:
// const leads = await getTableLeads({ limit: 20, offset: 0 });  // Page 1
// const leads = await getTableLeads({ limit: 20, offset: 20 }); // Page 2
// const leads = await getTableLeads({ limit: 20, offset: 40 }); // Page 3
