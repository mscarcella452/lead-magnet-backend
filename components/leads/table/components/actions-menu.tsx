import { memo, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import { DialogTrigger } from "@/components/ui/feedback/dialog";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { Button } from "@/components/ui/controls";
import { Eye, Pencil, MoreHorizontal, Trash2 } from "lucide-react";
import { DIALOG_TYPES, ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { getLeadWithRelationsAction } from "@/lib/server/actions/read/getLeadWithRelationsAction";
import { leadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import type { ActionsMenuProps } from "@/components/leads/table/lib/types";

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
    // if (result.success) {
    //   leadWithRelationsCache.set(lead.id, {
    //     notes: result.data.notes,
    //     activities: result.data.activities,
    //   });
    // }
  }, [lead.id]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) prefetchLead();
    },
    [prefetchLead],
  );
  const leadPayload = { leadId: lead.id, onLeadUpdated: refetch };

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
            payload={leadPayload}
          >
            <DropdownMenuItem>
              <Eye aria-hidden="true" />
              View
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.EDIT_LEAD}
            payload={leadPayload}
          >
            <DropdownMenuItem>
              <Pencil aria-hidden="true" />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <AlertDialogTrigger
            asChild
            dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
            payload={{ leadId: [lead.id] }}
          >
            <DropdownMenuItem variant="destructive">
              <Trash2 aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
