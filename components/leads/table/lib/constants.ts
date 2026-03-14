// ============================================================================
// Lead Table Constants
// ============================================================================

import type { SortField } from "@/lib/server/read/getTableLeads";

export const TABLE_COLUMNS: ReadonlyArray<{
  key: SortField;
  label: string;
}> = [
  { key: "name", label: "Name" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "createdAt", label: "Created" },
] as const;
