import "server-only";

import { parseSearchParams } from "@/components/dashboard/lib/helpers";
import {
  getTableLeads,
  getTableLeadsCount,
} from "@/lib/server/read/getTableLeads";
import { LeadsPanel } from "@/components/leads/panel";
import type { PageProps } from "@/components/dashboard/lib/types";

// ============================================================================
// LeadsSection
// ============================================================================

export async function LeadsSection({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const { page, ...tableParams } = parseSearchParams(searchParams);

  const [leads, total] = await Promise.all([
    getTableLeads(tableParams),
    getTableLeadsCount(),
  ]);

  return (
    <LeadsPanel initialLeadData={{ leads, total, page, ...tableParams }} />
  );
}
