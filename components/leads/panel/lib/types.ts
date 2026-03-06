import type { LeadTableRow } from "@/types/lead";
import type { SortField, SortOrder } from "@/lib/server/read/getTableLeads";

// ============================================================================
// Types
// ============================================================================

export interface InitialLeadData {
  leads: LeadTableRow[];
  limit: number;
  page: number;
  sortBy?: SortField;
  sortOrder: SortOrder;
  total: number;
}

export type LeadsPanelProps =
  | { error: string; initialLeadData?: never }
  | { error?: never; initialLeadData: InitialLeadData };
