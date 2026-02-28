"use client";

import { usePopoverContext } from "@/components/motion-primitives/morphing-popover";
import { deleteLeadNoteAction } from "@/lib/server/actions/write/deleteLeadNoteAction";
import { toast } from "sonner";
import { DeleteCard } from "@/components/lead-details/relations/notes/shared/cards/delete-card";

interface DeleteNotePopoverProps {
  leadId: string;
  noteId: string;
  fetchRelations: () => Promise<void>;
}

const DeleteNotePopover = ({
  leadId,
  noteId,
  fetchRelations,
}: DeleteNotePopoverProps) => {
  const { close: handleClosePopover } = usePopoverContext("DeleteNotePopover");

  const handleDeleteNote = async () => {
    try {
      const result = await deleteLeadNoteAction({
        leadId,
        noteId,
      });

      if (result.success) {
        fetchRelations();
        toast.success("Note deleted");
      } else {
        toast.error(result.error || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <DeleteCard
      title="Are you sure you want to delete this note?"
      onClose={handleClosePopover}
      onSubmit={handleDeleteNote}
      deleteLabel={{ deleting: "Deleting...", default: "Delete Note" }}
    />
  );
};

export { DeleteNotePopover };
