"use client";
import { memo } from "react";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/layout/dropdown-menu";
import { Trash2 } from "lucide-react";
import { DeleteLeadAlertPayload } from "@/types/ui/dialog";

interface DeleteLeadMenuItemProps {
  payload: DeleteLeadAlertPayload;
  label?: string;
}

export const DeleteLeadMenuItem = memo(function DeleteLeadMenuItem({
  payload,
  label = "Delete",
}: DeleteLeadMenuItemProps) {
  return (
    <AlertDialogTrigger
      asChild
      dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
      payload={payload}
    >
      <DropdownMenuItem variant="destructive">
        <Trash2 aria-hidden="true" />
        {label}
      </DropdownMenuItem>
    </AlertDialogTrigger>
  );
});
