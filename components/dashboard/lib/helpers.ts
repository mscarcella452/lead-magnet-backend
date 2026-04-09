import type { PageProps } from "@/components/dashboard/lib/types";
import type { SortField, SortOrder } from "@/lib/server/leads/read/getTableLeads";

// ============================================================================
// Helpers
// ============================================================================

export function parseSearchParams(params: Awaited<PageProps["searchParams"]>) {
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);
  const limit = Math.max(1, parseInt(params.limit ?? "10") || 10);
  return {
    page,
    limit,
    offset: (page - 1) * limit,
    sortBy: (params.sortBy as SortField) ?? "createdAt",
    sortOrder: (params.sortOrder as SortOrder) ?? "desc",
  };
}
