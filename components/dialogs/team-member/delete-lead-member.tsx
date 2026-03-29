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
import { deleteTeamMemberAction } from "@/lib/server/actions/write/deleteTeamMemberAction";
import { LoaderCircle, Trash2 } from "lucide-react";

export function DeleteMemberDialog({ userId }: DeleteMemberAlertPayload) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteLeads = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteTeamMemberAction(userId);
      if (result.success) {
        toast.success("Team member deleted successfully");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong deleting team member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialogContent variant="background" spacing="md">
      <AlertDialogHeader className="gap-dialog-y-xs">
        <AlertDialogTitle>Delete this team member?</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription>
        This action cannot be undone. This will permanently remove the team
        member and all associated data.
      </AlertDialogDescription>

      <AlertDialogFooter className="justify-end gap-4">
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
