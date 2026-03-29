"use client";

import { useMemo } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { Container } from "@/components/ui/layout/containers";
import { NoteItem } from "@/components/lead-details/view-lead/notes/note-item";
import { sortNotesByPinnedAt } from "@/components/lead-details/view-lead/notes/lib/helpers";
import { CreateNotePopover } from "@/components/lead-details/view-lead/notes/popovers/create-note-popover";
import { CreateNotePopoverWindow } from "@/components/lead-details/view-lead/notes/popovers/windows/create-note-popover-window";
import { NoteItemStateProvider } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { RelationsSection } from "@/components/lead-details/view-lead/shared/relations-section";

// ============================================================================
// LeadNotes - Notes section for a lead
// ============================================================================

const LeadNotes = ({ limit }: { limit?: number }) => {
  const { notes } = useNotesContext();

  // Display either limited notes or all notes from local state
  const displayedNotes = useMemo(() => {
    return sortNotesByPinnedAt(notes).slice(0, limit);
  }, [notes, limit]);

  const isFiltered = displayedNotes.length < notes.length;

  const hasNotes = notes.length > 0;

  return (
    <CreateNotePopoverWindow>
      <RelationsSection
        label="Notes"
        isFiltered={isFiltered}
        totalRelations={notes.length}
        action={<CreateNotePopover />}
      >
        <Container spacing="none" className="relative">
          <LayoutGroup id={`notes-${limit ?? "all"}`}>
            <AnimatePresence initial={false} mode="sync">
              {hasNotes &&
                displayedNotes.map((note, index) => (
                  <NoteItemStateProvider key={note.id}>
                    <NoteItem note={note} isFirstNote={index === 0} />
                  </NoteItemStateProvider>
                ))}
            </AnimatePresence>
          </LayoutGroup>
        </Container>
      </RelationsSection>
    </CreateNotePopoverWindow>
  );
};

export { LeadNotes };

//  <Container spacing="none" className="relative">
//           <LayoutGroup id={`notes-${limit ?? "all"}`}>
//             <AnimatePresence initial={false} mode="sync">
//               {hasNotes ? (
//                 displayedNotes.map((note, index) => (
//                   <NoteItemStateProvider key={note.id}>
//                     <NoteItem note={note} isFirstNote={index === 0} />
//                   </NoteItemStateProvider>
//                 ))
//               ) : (
//                 <motion.p key="no-notes-yet" {...LIST_OUTER_MOTION_PROPS}>
//                   <motion.span
//                     {...LIST_INNER_MOTION_PROPS}
//                     className="text-sm text-muted-foreground italic"
//                   >
//                     No notes yet
//                   </motion.span>
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </LayoutGroup>
//         </Container>
