import { LeadWithRelations } from "@/types";
import { RelationsHistory } from "@/components/lead-details/relations/relations-history";
import { NoteItem } from "@/components/lead-details/relations/notes/note-item";
import { CreateNotePopover } from "@/components/lead-details/relations/notes/popovers/create-note-popover";
import { useNotesContext } from "@/components/lead-details/relations/notes/providers/notes-context-provider";
import { sortNotesByPinnedAt } from "@/components/lead-details/relations/notes/lib/helpers";
import { CreateNotePopoverWindow } from "@/components/lead-details/relations/notes/popovers/windows/create-note-popover-window";
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
