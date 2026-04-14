"use client";

import { memo, useCallback } from "react";
import { Ellipsis, Mail, Phone, Video, Pencil } from "lucide-react";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { DIALOG_TYPES } from "@/types/ui/dialog";
import { Button } from "@/components/ui/controls";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/layout/dropdown-menu";
import type { LeadWithRelations } from "@/types";
import type {
  EditLeadDialogPayload,
  DeleteLeadAlertPayload,
} from "@/types/ui/dialog";
import { DeleteLeadMenuItem } from "@/components/leads/delete/delete-lead-menuItem";

// ============================================================================
// Types
// ============================================================================

interface LeadHeaderDropdownProps {
  lead: LeadWithRelations;
  onConfirm: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const COMMUNICATION_ACTIONS = [
  { label: "Message", icon: Mail },
  { label: "Call", icon: Phone },
  // { label: "Video Call", icon: Video },
] as const;

// ============================================================================
// DeleteLeadTrigger
// ============================================================================

const DeleteLeadTrigger = memo(function DeleteLeadTrigger({
  leadIds,
  onConfirm,
}: DeleteLeadAlertPayload) {
  const { closeDialog } = useDialogs();

  const handleOnDelete = useCallback(() => {
    onConfirm?.();
    closeDialog();
  }, [onConfirm, closeDialog]);

  return (
    <DeleteLeadMenuItem
      payload={{ leadIds, onConfirm: handleOnDelete }}
      label="Delete Lead"
    />
  );
});

// ============================================================================
// EditLeadTrigger
// ============================================================================

const EditLeadTrigger = memo(function EditLeadTrigger({
  leadId,
  onConfirm,
}: EditLeadDialogPayload) {
  const { switchActiveDialog } = useDialogs();

  const handleEdit = useCallback(() => {
    switchActiveDialog(DIALOG_TYPES.EDIT_LEAD, {
      leadId,
      onConfirm,
    });
  }, [leadId, onConfirm, switchActiveDialog]);

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
  onConfirm,
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
          <EditLeadTrigger leadId={lead.id} onConfirm={onConfirm} />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteLeadTrigger leadIds={[lead.id]} onConfirm={onConfirm} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
