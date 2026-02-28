import "server-only";
import { prisma } from "@/lib/db";
import { Lead, Prisma } from "@prisma/client";

export type SortField = "createdAt" | "name" | "email" | "status" | "source";
export type SortOrder = "asc" | "desc";

export interface GetLeadsOptions {
  limit?: number;
  offset?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

// /lib/queries/leads.ts (server-only function)
export async function getLeads(options?: GetLeadsOptions): Promise<Lead[]> {
  const sortBy = options?.sortBy ?? "createdAt";
  const sortOrder = options?.sortOrder ?? "desc";

  const orderBy: Prisma.LeadOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const leads = await prisma.lead.findMany({
    orderBy,
    take: options?.limit ?? 100,
    skip: options?.offset ?? 0,
  });
  return leads;
}

// pagenation example:
// const leads = await getLeads({ limit: 20, offset: 0 });  // Page 1
// const leads = await getLeads({ limit: 20, offset: 20 }); // Page 2
// const leads = await getLeads({ limit: 20, offset: 40 }); // Page 3
