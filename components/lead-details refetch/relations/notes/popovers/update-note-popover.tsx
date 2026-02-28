import { toast } from "sonner";
import { NoteForm } from "@/components/lead-details/relations/notes/shared/cards/note-form-card";
import { Note } from "@prisma/client";
import { updateLeadNoteAction } from "@/lib/server/actions/write/updateLeadNoteAction";

interface UpdateNotePopoverProps {
  leadId: string;
  fetchRelations: () => Promise<void>;
  onClose: () => void;
  note: Note;
}

const UpdateNotePopover = ({
  leadId,
  fetchRelations,
  onClose,
  note,
}: UpdateNotePopoverProps) => {
  const handleUpdateNote = async (newNote: string) => {
    try {
      const result = await updateLeadNoteAction({
        leadId,
        noteId: note.id,
        content: newNote,
      });

      if (result.success) {
        fetchRelations();
        toast.success("Note updated");
      } else {
        toast.error(result.error || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  return (
    <NoteForm
      onClose={onClose}
      onSubmit={handleUpdateNote}
      placeholderLabel="Edit Note"
      submitLabel={{ submitting: "Updating...", default: "Update" }}
      initialNote={note.content}
    />
  );
};

export { UpdateNotePopover };
