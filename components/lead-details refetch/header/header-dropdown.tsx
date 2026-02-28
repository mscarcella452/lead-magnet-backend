import { Lead } from "@/types";
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
} from "@/components/ui/dropdown-menu";

/**
 * LeadHeaderDropdown
 *
 * Renders a dropdown menu for lead-level actions: communication options
 * (message, call, video), editing, and deletion.
 *
 * Used in the lead detail header to keep the UI compact while exposing
 * all relevant actions behind a single trigger.
 */

// ============================================================================
// Types
// ============================================================================

/** Props for the top-level dropdown, requires the full Lead for edit/delete. */
interface LeadHeaderDropdownProps {
  lead: Lead;
}

/** Props for the delete trigger — only needs the lead's ID. */
interface DeleteLeadTriggerProps {
  leadId: string;
}

/** Props for the edit trigger — needs the full Lead to pre-populate the form. */
interface EditLeadTriggerProps {
  lead: Lead;
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * DeleteLeadTrigger
 *
 * Wraps a destructive DropdownMenuItem in an AlertDialogTrigger so that
 * clicking "Delete Lead" always prompts a confirmation before acting.
 * On confirmation, the parent view-lead dialog is also closed.
 */
const DeleteLeadTrigger = ({ leadId }: DeleteLeadTriggerProps) => {
  const { closeDialog } = useDialogs();

  return (
    <AlertDialogTrigger
      asChild
      dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
      payload={{
        leadId: [leadId],
        // Close the view-lead dialog after a successful delete
        onConfirm: closeDialog,
      }}
    >
      <DropdownMenuItem variant="destructive">
        <Trash2 aria-hidden="true" />
        Delete Lead
      </DropdownMenuItem>
    </AlertDialogTrigger>
  );
};

/**
 * EditLeadTrigger
 *
 * Switches the active dialog to EDIT_LEAD, passing the full lead object
 * so the edit form can be pre-populated without an additional fetch.
 */
const EditLeadTrigger = ({ lead }: EditLeadTriggerProps) => {
  const { switchActiveDialog } = useDialogs();

  const handleEdit = () => switchActiveDialog(DIALOG_TYPES.EDIT_LEAD, lead);

  return (
    <DropdownMenuItem onClick={handleEdit}>
      <Pencil aria-hidden="true" />
      Edit Lead
    </DropdownMenuItem>
  );
};

// ===========================================================================
// Communication action config
// Defined outside the component to avoid re-creation on every render.
// ===========================================================================

const COMMUNICATION_ACTIONS = [
  { label: "Message", icon: Mail },
  { label: "Call", icon: Phone },
  { label: "Video Call", icon: Video },
] as const;

// ============================================================================
// Main export
/**
 * LeadHeaderDropdown
 *
 * Entry point for this module. Composes the communication action group
 * alongside the edit and delete triggers in a single accessible dropdown.
 */
// ============================================================================

const LeadHeaderDropdown = ({ lead }: LeadHeaderDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        intent="soft"
        size="responsive-sm"
        mode="iconOnly"
        aria-label="Lead actions"
      >
        <Ellipsis aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-36 bg-card">
      {/* Communication actions: message, call, video call */}
      <DropdownMenuGroup>
        {COMMUNICATION_ACTIONS.map(({ label, icon: Icon }) => (
          <DropdownMenuItem key={label}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      {/* Edit lead — switches to the edit dialog */}
      <DropdownMenuGroup>
        <EditLeadTrigger lead={lead} />
      </DropdownMenuGroup>

      {/* Delete lead — requires confirmation via alert dialog */}
      <DropdownMenuGroup>
        <DeleteLeadTrigger leadId={lead.id} />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

export { LeadHeaderDropdown };
