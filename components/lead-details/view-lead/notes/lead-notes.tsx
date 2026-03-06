import { RelationsHistory } from "@/components/lead-details/view-lead/shared/relations-history";
import { NoteItem } from "@/components/lead-details/view-lead/notes/note-item";
import { CreateNotePopover } from "@/components/lead-details/view-lead/notes/popovers/create-note-popover";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { sortNotesByPinnedAt } from "@/components/lead-details/view-lead/notes/lib/helpers";
import { CreateNotePopoverWindow } from "@/components/lead-details/view-lead/notes/popovers/windows/create-note-popover-window";
import { useEffect, useRef, useMemo } from "react";

// ============================================================================
// LeadNotes - Notes section for a lead
// ============================================================================

const LeadNotes = ({ limit }: { limit?: number }) => {
  const { notes } = useNotesContext();

  // Display either limited notes or all notes from local state
  const displayedNotes = useMemo(() => {
    return sortNotesByPinnedAt(notes).slice(0, limit);
  }, [notes, limit]);

  const shouldAnimateRef = useRef(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      shouldAnimateRef.current = true;
    });
  }, []);

  return (
    <CreateNotePopoverWindow>
      <RelationsHistory
        label="Notes"
        relations={displayedNotes}
        totalRelations={notes.length}
        shouldAnimate={shouldAnimateRef.current}
        Item={NoteItem}
        action={<CreateNotePopover />}
      />
    </CreateNotePopoverWindow>
  );
};

export { LeadNotes };
