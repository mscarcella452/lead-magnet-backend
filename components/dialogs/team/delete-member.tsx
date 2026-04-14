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
import type { DeleteMemberAlertPayload } from "@/types/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTeamMemberAction } from "@/lib/server/team/actions/write/deleteTeamMemberAction";
import { LoaderCircle, Trash2 } from "lucide-react";

// ============================================================
// Types
// ============================================================

interface DialogCopy {
  title: string;
  description: string;
  actionLabel: string;
  successMessage: string;
}

// ============================================================
// Copy
// ============================================================

const CANCEL_INVITE_COPY: DialogCopy = {
  title: "Cancel this invite?",
  description:
    "This will cancel the pending invite. The user will no longer be able to set up their account.",
  actionLabel: "Cancel Invite",
  successMessage: "Invite cancelled successfully.",
};

const DELETE_MEMBER_COPY: DialogCopy = {
  title: "Delete this team member?",
  description:
    "This action cannot be undone. This will permanently remove the team member and all associated data.",
  actionLabel: "Delete",
  successMessage: "Team member deleted successfully.",
};

// ============================================================
// DeleteMemberDialog
// ============================================================

export function DeleteMemberDialog({
  userId,
  isPendingInvite,
}: DeleteMemberAlertPayload) {
  const [isDeleting, setIsDeleting] = useState(false);

  // ------------------------------------------------------------
  // Copy
  // ------------------------------------------------------------

  const { title, description, actionLabel, successMessage } = isPendingInvite
    ? CANCEL_INVITE_COPY
    : DELETE_MEMBER_COPY;

  // ------------------------------------------------------------
  // Handle Delete
  // ------------------------------------------------------------

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    const result = await deleteTeamMemberAction(userId);
    if (result.success) {
      toast.success(successMessage);
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader className="gap-dialog-y-xs">
        <AlertDialogTitle>{title}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>{description}</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Trash2 aria-hidden="true" />
          )}
          {actionLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
