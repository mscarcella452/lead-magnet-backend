"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteLeadAction } from "@/lib/server/actions/write/deleteLeadAction";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/feedback/alert-dialog";

import { Button } from "@/components/ui/controls";
import { Trash2 } from "lucide-react";
import { AlertDialogPayloads, ALERT_DIALOG_TYPES } from "@/types/ui/dialog";

export function DeleteLeadDialog({
  leadId,
  onConfirm,
}: AlertDialogPayloads[typeof ALERT_DIALOG_TYPES.DELETE_LEAD]) {
  const [isDeleting, setIsDeleting] = useState(false);

  // const handleDelete = async () => {
  //   if (isDeleting) return;

  //   setIsDeleting(true);

  //   try {
  //     const result = await deleteLeadAction(leadId);

  //     if (result.success) {
  //       const successMessage =
  //         leadId.length === 1
  //           ? `Lead "${leadId[0]}" deleted`
  //           : `${leadId.length} leads deleted`;
  //       toast.success(successMessage);

  //     } else {
  //       toast.error(result.error);
  //     }
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };

  const handleDelete = () => {
    onConfirm?.();
    console.log("Delete");
  };

  return (
    <AlertDialogContent variant="background" spacing="md">
      <AlertDialogHeader className="gap-dialog-y-xs">
        <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription>
        This action cannot be undone. This will permanently remove the lead and
        all associated data.
      </AlertDialogDescription>

      <AlertDialogFooter className="justify-end gap-4">
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
          <Trash2 />
          {isDeleting ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
