import { memo, useCallback } from "react";
import { TableCell } from "@/components/ui/layout/table";
import { StatusDropdown } from "@/components/field-controls/status";
import { updateLeadStatusAction } from "@/lib/server/leads/actions/write/updateLeadStatusAction";
import { invalidateLeadWithRelationsCache } from "@/lib/server/leads/cache";
import { toast } from "sonner";
import { LeadStatus } from "@prisma/client";
import type { StatusTableCellProps } from "@/components/leads/table/lib/types";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================================
// Status Table Cell
// ============================================================================

export const StatusTableCell = memo(function StatusTableCell({
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
