import { toast } from "sonner";
import { NoteFormCard } from "@/components/lead-details/view-lead/notes/popovers/shared/note-form-card";
import { Note } from "@/types";
import { updateLeadNoteAction } from "@/lib/server/leads/actions/write/updateLeadNoteAction";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { invalidateLeadWithRelationsCache } from "@/lib/server/leads/cache";
import { useNoteItemState } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";

// ============================================================
// Types
// ============================================================
interface UpdateNotePopoverProps {
  note: Note;
}

// ============================================================
// UpdateNotePopover
// ============================================================

const UpdateNotePopover = ({ note }: UpdateNotePopoverProps) => {
  const { dispatch, leadId } = useNotesContext();

  const { setPendingAction, close: onClose } = useNoteItemState();

  const onUpdateSuccess = (payload: Note) => {
    setPendingAction(() => () => {
      dispatch({
        type: "UPDATE",
        payload: { id: payload.id, updates: payload },
      });
      invalidateLeadWithRelationsCache(leadId);
    });
  };

  const handleUpdateNote = async (newContent: string) => {
    // Close immediately so the animation runs concurrently with the db call
    onClose();
    try {
      const result = await updateLeadNoteAction({
        leadId,
        noteId: note.id,
        content: newContent,
      });
      if (!result.success) {
        toast.error(result.error || "Failed to update note");
        return;
      }
      toast.success("Note updated");
      // Arms the pending action in the provider to replace local state with
      // the server-authoritative note once the closing animation has fully completed
      onUpdateSuccess(result.data);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  return (
    <NoteFormCard
      onSubmit={handleUpdateNote}
      placeholderLabel="Edit Note"
      submitLabel="Update"
      initialNote={note.content}
    />
  );
};

export { UpdateNotePopover };
