"use client";

import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/feedback/alert-dialog";
import type { DeleteLeadAlertPayload } from "@/types/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { deleteLeadAction } from "@/lib/server/leads/actions/write/deleteLeadAction";
import { LoaderCircle, Trash2 } from "lucide-react";

export function DeleteLeadDialog({
  leadIds,
  onConfirm,
}: DeleteLeadAlertPayload) {
  const [isDeleting, setIsDeleting] = useState(false);

  const copy =
    leadIds.length === 1
      ? {
          title: "Delete this lead?",
          description:
            "This action cannot be undone. This will permanently remove the lead and all associated data.",
          toast: "Lead deleted successfully",
        }
      : {
          title: `Delete ${leadIds.length} leads?`,
          description:
            "This action cannot be undone. This will permanently remove the leads and all associated data.",
          toast: `${leadIds.length} leads deleted successfully`,
        };

  const handleDeleteLeads = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteLeadAction(leadIds);
      if (result.success) {
        toast.success(copy.toast);
        onConfirm?.();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong deleting leads");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialogContent variant="background" spacing="md">
      <AlertDialogHeader className="gap-dialog-y-xs">
        <AlertDialogTitle>{copy.title}</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription>{copy.description}</AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

        <AlertDialogAction
          onClick={handleDeleteLeads}
          disabled={isDeleting}
          aria-live="polite"
        >
          {isDeleting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Trash2 aria-hidden="true" />
          )}
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
