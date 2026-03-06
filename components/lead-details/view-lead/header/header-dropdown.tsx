"use client";

import { memo, useCallback } from "react";
import { Ellipsis, Mail, Phone, Trash2, Video, Pencil } from "lucide-react";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { ALERT_DIALOG_TYPES, DIALOG_TYPES } from "@/types/ui/dialog";
import { Button } from "@/components/ui/controls";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import type { LeadWithRelations } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface LeadHeaderDropdownProps {
  lead: LeadWithRelations;
  onLeadUpdated: () => void;
}

interface DeleteLeadTriggerProps {
  leadId: string;
}

interface EditLeadTriggerProps {
  leadId: string;
  onLeadUpdated: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const COMMUNICATION_ACTIONS = [
  { label: "Message", icon: Mail },
  { label: "Call", icon: Phone },
  { label: "Video Call", icon: Video },
] as const;

// ============================================================================
// DeleteLeadTrigger
// ============================================================================

const DeleteLeadTrigger = memo(function DeleteLeadTrigger({
  leadId,
}: DeleteLeadTriggerProps) {
  const { closeDialog } = useDialogs();

  return (
    <AlertDialogTrigger
      asChild
      dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
      payload={{
        leadId: [leadId],
        onConfirm: closeDialog,
      }}
    >
      <DropdownMenuItem variant="destructive">
        <Trash2 aria-hidden="true" />
        Delete Lead
      </DropdownMenuItem>
    </AlertDialogTrigger>
  );
});

// ============================================================================
// EditLeadTrigger
// ============================================================================

const EditLeadTrigger = memo(function EditLeadTrigger({
  leadId,
  onLeadUpdated,
}: EditLeadTriggerProps) {
  const { switchActiveDialog } = useDialogs();

  const handleEdit = useCallback(() => {
    switchActiveDialog(DIALOG_TYPES.EDIT_LEAD, {
      leadId,
      onLeadUpdated, // threaded through so table refetches after edit
    });
  }, [leadId, onLeadUpdated, switchActiveDialog]);

  return (
    <DropdownMenuItem onClick={handleEdit}>
      <Pencil aria-hidden="true" />
      Edit Lead
    </DropdownMenuItem>
  );
});

// ============================================================================
// LeadHeaderDropdown
// ============================================================================

export const LeadHeaderDropdown = memo(function LeadHeaderDropdown({
  lead,
  onLeadUpdated,
}: LeadHeaderDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          intent="soft"
          size="xs"
          mode="iconOnly"
          aria-label="Lead actions"
        >
          <Ellipsis aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 bg-card">
        <DropdownMenuGroup>
          {COMMUNICATION_ACTIONS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <EditLeadTrigger leadId={lead.id} onLeadUpdated={onLeadUpdated} />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteLeadTrigger leadId={lead.id} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
