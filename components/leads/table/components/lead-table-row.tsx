// ============================================================================
// Lead Table Row Component
// ============================================================================

import { memo, useCallback } from "react";
import { TableCell, TableRow } from "@/components/ui/layout/table";
import { Badge } from "@/components/ui/feedback/badge";
import { Checkbox } from "@/components/ui/controls/checkbox";
import { StatusDropdown } from "@/components/leads/status/status-dropdown";
import { ActionsMenu } from "@/components/leads/table/components/actions-menu";
import { formatDate } from "@/lib/utils/dates";
import { updateLeadStatusAction } from "@/lib/server/actions/write/updateLeadStatusAction";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import { toast } from "sonner";
import { LeadStatus } from "@prisma/client";
import type {
  LeadTableRowProps,
  StatusTableCellProps,
} from "@/components/leads/table/lib/types";

// ============================================================================
// Status Table Cell
// ============================================================================

const StatusTableCell = memo(function StatusTableCell({
  leadId,
  status,
  refetch,
}: StatusTableCellProps) {
  const onStatusChange = useCallback(
    async (newStatus: LeadStatus) => {
      if (newStatus === status) return;

      const result = await updateLeadStatusAction({
        leadId,
        newStatus,
        performedBy: "You",
      });

      if (result.success) {
        toast.success(`Lead status updated from ${status} to ${newStatus}`);
        invalidateLeadWithRelationsCache(leadId);
        refetch();
      } else {
        toast.error(result.error);
        throw new Error(result.error);
      }
    },
    [leadId, status, refetch],
  );

  return (
    <TableCell>
      <StatusDropdown currentStatus={status} onStatusChange={onStatusChange} />
    </TableCell>
  );
});

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
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleToggle}
          aria-label={`Select ${lead.name ?? lead.displayId}`}
        />
      </TableCell>

      <TableCell className="text-sm">{lead.name || "—"}</TableCell>

      <TableCell>
        {lead.source ? (
          <Badge variant="primary" intent="soft" size="sm">
            {lead.source}
          </Badge>
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

      <TableCell className="text-xs text-subtle-foreground">
        <time dateTime={new Date(lead.createdAt).toISOString()}>
          {formatDate(lead.createdAt)}
        </time>
      </TableCell>

      <TableCell className="text-right">
        <ActionsMenu lead={lead} refetch={refetch} />
      </TableCell>
    </TableRow>
  );
});
