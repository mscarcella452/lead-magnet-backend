"use client";

import { deleteLeadNoteAction } from "@/lib/server/actions/write/deleteLeadNoteAction";
import { toast } from "sonner";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/layout/card";
import { Button } from "@/components/ui/controls";
import { Trash2 } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";
import { useNoteItemState } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";

// ============================================================
// Types
// ============================================================
interface DeleteNotePopoverProps {
  noteId: string;
}

// ============================================================
//  DeleteNotePopover
// ============================================================

const DeleteNotePopover = ({ noteId }: DeleteNotePopoverProps) => {
  const { leadId, dispatch } = useNotesContext();
  const { setPendingAction, close: onClose } = useNoteItemState();

  const onDeleteSuccess = ({ noteId }: { noteId: string }) => {
    setPendingAction(() => () => {
      dispatch({ type: "DELETE", payload: noteId });
      toast.info("Note deleted");
      invalidateLeadWithRelationsCache(leadId);
    });
  };

  const handleDeleteNote = async () => {
    // Close immediately so the animation runs concurrently with the db call
    onClose();
    try {
      const result = await deleteLeadNoteAction({ leadId, noteId });
      if (!result.success) {
        toast.error(result.error || "Failed to delete note");
        return;
      }
      // Arms the pending action in the provider to remove from local state
      // once the closing animation has fully completed
      onDeleteSuccess({ noteId });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Card
      variant="background"
      size="sm"
      border={true}
      role="alertdialog"
      aria-labelledby="delete-card-title"
      aria-describedby="delete-card-description"
    >
      <CardHeader>
        <CardTitle id="delete-card-title" className="max-lg:text-sm">
          Are you sure you want to delete this note?
        </CardTitle>
      </CardHeader>
      <CardContent
        id="delete-card-description"
        className="text-xs @lg:text-sm text-muted-foreground"
      >
        This action cannot be undone.
      </CardContent>
      <CardFooter>
        <Container
          key="close"
          spacing="group"
          className="flex flex-row items-center justify-between @lg:justify-end mt-card-y-xs"
        >
          <Button intent="outline" size="responsive-sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="responsive-sm"
            onClick={handleDeleteNote}
            aria-label="Delete Note"
          >
            <Trash2 />
            Delete Note
          </Button>
        </Container>
      </CardFooter>
    </Card>
  );
};

export { DeleteNotePopover };
