"use client";

import { Note } from "@prisma/client";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverAnchor,
} from "@/components/ui/controls/morphing-popover";
import { Overlay } from "@/components/ui/feedback/overlay";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { DeleteNotePopover } from "@/components/lead-details/view-lead/notes/popovers/delete-note-popover";
import { UpdateNotePopover } from "@/components/lead-details/view-lead/notes/popovers/update-note-popover";
import { getTranslateYToCenter } from "@/components/lead-details/view-lead/notes/lib/helpers";
import { useNoteItemState } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";

// ============================================================================
// NotePopoverOverlay
// ============================================================================

export const NotePopoverOverlay = () => {
  const { noteState, isOpen } = useNoteItemState();
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          className={cn("z-10", {
            "cursor-default": noteState.popoverContent === "delete",
          })}
          transition={CARD_MOTION_TRANSITION}
        />
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// NotePopoverWindow
// ============================================================================

export function NotePopoverWindow({
  children,
  cardRef,
  note,
}: {
  children: React.ReactNode;
  cardRef: React.RefObject<HTMLDivElement>;
  note: Note;
}) {
  const { contentRef: dialogContentRef } = useNotesContext();

  const { noteState, isOpen, close, open } = useNoteItemState();

  const handleOpenChange = (shouldOpen: boolean) => {
    if (!shouldOpen) {
      close();
      return;
    }

    if (!cardRef.current) return;

    const translateY = getTranslateYToCenter({
      targetRect: cardRef.current.getBoundingClientRect(),
      containerRect: dialogContentRef?.current?.getBoundingClientRect(),
    });

    open(translateY);
  };

  const popoverSide = noteState.translateY > 0 ? "bottom" : "top";

  return (
    <MorphingPopover
      open={isOpen}
      onOpenChange={handleOpenChange}
      transition={CARD_MOTION_TRANSITION}
    >
      <MorphingPopoverAnchor />

      {children}
      <MorphingPopoverContent
        side={popoverSide}
        className="w-full bg-transparent border-none"
        disableClickOutside={noteState.popoverContent === "delete"}
      >
        {noteState.popoverContent === "update" ? (
          <UpdateNotePopover note={note} />
        ) : (
          <DeleteNotePopover noteId={note.id} />
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}
