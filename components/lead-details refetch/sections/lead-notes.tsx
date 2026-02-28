import { LeadWithRelations } from "@/types";
import { useState } from "react";
import { RelationsHistory } from "@/components/lead-details/relations/relations-history";
import { NoteItem } from "@/components/lead-details/relations/notes/note-item";
import { MorphingPopover } from "@/components/motion-primitives/morphing-popover";
import { CreateNotePopover } from "@/components/lead-details/relations/notes/popovers/create-note-popover";

// ============================================================================
// types
// ============================================================================

interface LeadNotesProps {
  lead: LeadWithRelations;
  limit?: number;
}

// ============================================================================
// LeadNotes - Notes section for a lead
// ============================================================================

const LeadNotes = ({ lead, limit }: LeadNotesProps) => {
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsCreateNoteOpen(open);
  };

  // Display either limited notes or all notes
  const displayedNotes = lead.notes.slice(0, limit);

  return (
    <MorphingPopover open={isCreateNoteOpen} onOpenChange={onOpenChange}>
      <RelationsHistory
        label="Notes"
        relations={displayedNotes}
        totalRelations={lead.notes.length}
        Item={NoteItem}
        action={<CreateNotePopover />}
      />
    </MorphingPopover>
  );
};

export { LeadNotes };
