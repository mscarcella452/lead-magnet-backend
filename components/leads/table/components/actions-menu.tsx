import { memo, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import { DialogTrigger } from "@/components/ui/feedback/dialog";
import { Button } from "@/components/ui/controls";
import { Eye, Pencil, MoreHorizontal } from "lucide-react";
import { DIALOG_TYPES } from "@/types/ui/dialog";
import { getLeadWithRelationsAction } from "@/lib/server/leads/actions/read/getLeadWithRelationsAction";
import { leadWithRelationsCache } from "@/lib/server/leads/cache";
import type { ActionsMenuProps } from "@/components/leads/table/lib/types";
import { DeleteLeadMenuItem } from "@/components/leads/delete/delete-lead-menuItem";

// ============================================================================
// Actions Menu Component
// ============================================================================

export const ActionsMenu = memo(function ActionsMenu({
  lead,
  refetch,
}: ActionsMenuProps) {
  const prefetchLead = useCallback(async () => {
    if (leadWithRelationsCache.has(lead.id)) return;

    const result = await getLeadWithRelationsAction(lead.id);
    if (result.success) {
      leadWithRelationsCache.set(lead.id, result.data); // ✅ full lead
    }
  }, [lead.id]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) prefetchLead();
    },
    [prefetchLead],
  );

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          intent="ghost"
          size="sm"
          mode="iconOnly"
          aria-label={`Open actions for ${lead.name ?? "this lead"}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.VIEW_LEAD}
            payload={{
              leadId: lead.id,
              onConfirm: refetch,
            }}
          >
            <DropdownMenuItem>
              <Eye aria-hidden="true" />
              View
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.EDIT_LEAD}
            payload={{
              leadId: lead.id,
              onConfirm: refetch,
            }}
          >
            <DropdownMenuItem>
              <Pencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteLeadMenuItem
            payload={{ leadIds: [lead.id], onConfirm: refetch }}
            label="Delete Lead"
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
