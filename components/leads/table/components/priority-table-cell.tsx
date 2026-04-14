import { memo, useCallback } from "react";
import { TableCell } from "@/components/ui/layout/table";
import { PriorityDropdown } from "@/components/field-controls/priority";
import { updateLeadPriorityAction } from "@/lib/server/leads/actions/write/updateLeadPriorityAction";
import { invalidateLeadWithRelationsCache } from "@/lib/server/leads/cache";
import { toast } from "sonner";
import { LeadPriority } from "@prisma/client";
import type { PriorityTableCellProps } from "@/components/leads/table/lib/types";

// ============================================================================
// Priority Table Cell
// ============================================================================

export const PriorityTableCell = memo(function PriorityTableCell({
  leadId,
  priority,
  refetch,
}: PriorityTableCellProps) {
  const onPriorityChange = useCallback(
    async (newPriority: LeadPriority) => {
      if (newPriority === priority) return;

      const result = await updateLeadPriorityAction({
        leadId,
        newPriority,
      });

      if (result.success) {
        toast.success(
          `Lead priority updated from ${priority} to ${newPriority}`,
        );
        invalidateLeadWithRelationsCache(leadId);
        refetch();
      } else {
        toast.error(result.error);
        throw new Error(result.error);
      }
    },
    [leadId, priority, refetch],
  );

  return (
    <TableCell>
      <PriorityDropdown
        currentPriority={priority}
        onPriorityChange={onPriorityChange}
      />
    </TableCell>
  );
});
