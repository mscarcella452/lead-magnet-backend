import type { LeadTableRow } from "@/types";
import type { LeadStatus, LeadPriority } from "@prisma/client";

// ============================================================================
// Lead Table Types
// ============================================================================

import type { SortField } from "@/lib/server/leads/read/getTableLeads";

export type SortDirection = "asc" | "desc";

export interface LeadTableProps {
  leads: LeadTableRow[];
  onSort?: (field: SortField) => void;
  sortBy?: SortField;
  sortOrder?: SortDirection;
  refetch: () => void;
}

export interface CheckboxHeaderProps {
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
}

export interface SortableHeaderProps {
  field: SortField;
  label: string;
  onSort?: (field: SortField) => void;
  sortBy?: SortField;
  sortOrder?: SortDirection;
}

export interface ActionsMenuProps {
  lead: LeadTableRow;
  refetch: () => void;
}

export interface LeadTableRowProps {
  lead: LeadTableRow;
  isSelected: boolean;
  onToggle: (leadId: string) => void;
  refetch: () => void;
}

export interface StatusTableCellProps {
  leadId: string;
  status: LeadStatus;
  refetch: () => void;
}
export interface PriorityTableCellProps {
  leadId: string;
  priority: LeadPriority;
  refetch: () => void;
}
