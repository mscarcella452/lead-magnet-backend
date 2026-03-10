import { memo } from "react";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { Button, ControlLabel, ButtonProps } from "@/components/ui/controls";
import { Trash2 } from "lucide-react";

interface BulkDeleteLeadsButtonProps extends ButtonProps {
  selectedLeads: Set<string>;
  onConfirm: () => void;
  label?: string;
  hideLabel?: boolean;
}

export const BulkDeleteLeadsButton = memo(function BulkDeleteLeadsButton({
  selectedLeads,
  onConfirm,
  label,
  hideLabel,
}: BulkDeleteLeadsButtonProps) {
  const ariaLabel =
    selectedLeads.size === 1
      ? "Delete lead"
      : `Delete ${selectedLeads.size} leads`;

  return (
    <AlertDialogTrigger
      asChild
      dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
      payload={{
        leadIds: Array.from(selectedLeads),
        onConfirm,
      }}
    >
      <Button
        variant="destructive"
        intent="solid"
        size="xs"
        aria-label={ariaLabel}
        className="@max-lg:h-control-h-sm"
      >
        <Trash2 aria-hidden="true" />
        {!hideLabel && <ControlLabel>{label ?? "Delete"}</ControlLabel>}
      </Button>
    </AlertDialogTrigger>
  );
});
