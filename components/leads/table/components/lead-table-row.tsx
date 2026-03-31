// ============================================================================
// Lead Table Row Component
// ============================================================================

import { memo, useCallback } from "react";
import { TableCell, TableRow } from "@/components/ui/layout/table";
import { SourceBadge } from "@/components/leads/source/source-badge";
import { Checkbox } from "@/components/ui/controls/checkbox";
import { ActionsMenu } from "@/components/leads/table/components/actions-menu";
import { formatDate } from "@/lib/utils/dates";
import type { LeadTableRowProps } from "@/components/leads/table/lib/types";
import { StatusTableCell } from "@/components/leads/table/components/status-table-cell";
import { PriorityTableCell } from "@/components/leads/table/components/priority-table-cell";

// ============================================================================
// Lead Table Row
// ============================================================================

export const LeadTableRow = memo(function LeadTableRow({
  lead,
  isSelected,
  onToggle,
  refetch,
}: LeadTableRowProps) {
  const handleToggle = useCallback(() => {
    onToggle(lead.id);
  }, [lead.id, onToggle]);

  return (
    <TableRow data-state={isSelected ? "selected" : undefined}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleToggle}
          aria-label={`Select ${lead.name ?? lead.displayId}`}
        />
      </TableCell>

      <TableCell className="text-sm text-muted-foreground min-w-0 @max-2xl:max-w-36 overflow-hidden">
        <span className="block truncate">{lead.name || "—"}</span>
      </TableCell>

      <TableCell>
        {lead.source ? (
          <SourceBadge source={lead.source} className="mx-auto" />
        ) : (
          <span
            className="text-muted-foreground text-sm"
            aria-label="No source"
          >
            —
          </span>
        )}
      </TableCell>

      <StatusTableCell
        leadId={lead.id}
        status={lead.status}
        refetch={refetch}
      />

      <PriorityTableCell
        leadId={lead.id}
        priority={lead.priority}
        refetch={refetch}
      />

      <TableCell className="text-xs text-subtle-foreground">
        <time dateTime={new Date(lead.createdAt).toISOString()}>
          {formatDate(lead.createdAt)}
        </time>
      </TableCell>

      <TableCell>
        <ActionsMenu lead={lead} refetch={refetch} />
      </TableCell>
    </TableRow>
  );
});
