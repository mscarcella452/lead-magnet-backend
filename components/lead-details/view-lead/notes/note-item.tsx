"use client";

import { Note } from "@prisma/client";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { NoteCard } from "@/components/lead-details/view-lead/notes/shared/note-card";
import {
  NotePopoverWindow,
  NotePopoverOverlay,
} from "@/components/lead-details/view-lead/notes/popovers/windows/note-popover-window";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";
import { type CardProps } from "@/components/ui/layout/card";
import { useNoteItemState } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";
import {
  LIST_INNER_MOTION_PROPS,
  LIST_OUTER_MOTION_PROPS,
} from "../shared/list-motion-variants";

// ============================================================================
// Types
// ============================================================================

interface NoteItemProps extends CardProps {
  note: Note;
  isFirstNote: boolean;
}

// ============================================================================
// NoteItem
// ============================================================================

export const NoteItem = forwardRef<HTMLDivElement, NoteItemProps>(
  function NoteItem({ note, isFirstNote, ...props }, ref) {
    const cardRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;

    const {
      noteState,
      isOpen,
      isTranslated,
      onClosingComplete: onPopoverClosingComplete,
    } = useNoteItemState();

    return (
      <>
        <NotePopoverOverlay />

        {/*---------------------------------------------------------------- 
  Positioning layer — handles layout reordering (pin/unpin) and
  vertical translation when the popover is open 
  ---------------------------------------------------------------- */}
        <motion.div
          ref={ref}
          layout
          layoutId={note.id}
          key={note.id}
          animate={{ y: isOpen ? noteState.translateY : 0 }}
          transition={CARD_MOTION_TRANSITION}
          className={cn("origin-top w-full ", {
            "z-50": isTranslated,
          })}
          onAnimationComplete={onPopoverClosingComplete}
        >
          {/* ---------------------------------------------------------------- 
    Collapse layer — animates height and opacity when the note
    enters or exits the list (add, delete, limit threshold) 
    ---------------------------------------------------------------- */}
          <motion.div {...LIST_OUTER_MOTION_PROPS}>
            {/* ---------------------------------------------------------------- 
      Visual layer — animates the card's blur, scale and fade
      when entering or exiting the list 
      ---------------------------------------------------------------- */}
            <motion.div {...LIST_INNER_MOTION_PROPS}>
              <NotePopoverWindow note={note} cardRef={cardRef}>
                {/* mt-2 is meant to mimic container spacing item */}
                <span className={cn("w-full", { "mt-2": !isFirstNote })}>
                  <NoteCard note={note} cardRef={cardRef} {...props} />
                </span>
              </NotePopoverWindow>
            </motion.div>
          </motion.div>
        </motion.div>
      </>
    );
  },
);
