"use client";

import { Note } from "@prisma/client";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { NoteCard } from "@/components/lead-details/view-lead/notes/shared/note-card";
import {
  NotePopoverWindow,
  NotePopoverOverlay,
} from "@/components/lead-details/view-lead/notes/popovers/windows/note-popover-window";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";
import { type CardProps } from "@/components/ui/layout/card";
import {
  NoteItemStateProvider,
  useNoteItemState,
} from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";

// ============================================================================
// Types
// ============================================================================

interface NoteItemProps extends CardProps {
  relation: Note;
  shouldAnimate?: boolean;
}

// ============================================================================
// NoteItem
// ============================================================================

export function NoteItem({ relation, shouldAnimate, ...props }: NoteItemProps) {
  return (
    <NoteItemStateProvider>
      <NoteItemContent
        relation={relation}
        shouldAnimate={shouldAnimate}
        {...props}
      />
    </NoteItemStateProvider>
  );
}
const motionVariants = {
  initial: { opacity: 0, x: 100 },
  exit: { opacity: 0, x: 100 },
};

const NoteItemContent = ({
  relation: note,
  shouldAnimate,
  ...cardProps
}: NoteItemProps) => {
  const {
    noteState,
    isOpen,
    isTranslated,
    onClosingComplete: onPopoverClosingComplete,
  } = useNoteItemState();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <NotePopoverOverlay />
      <AnimatePresence mode="wait">
        <motion.div
          layout
          key={note.id}
          initial={shouldAnimate ? motionVariants.initial : false}
          animate={{ opacity: 1, x: 0, y: isOpen ? noteState.translateY : 0 }}
          exit={shouldAnimate ? motionVariants.exit : undefined}
          transition={CARD_MOTION_TRANSITION}
          className={cn("origin-top w-full z-0 ", {
            "z-50": isTranslated,
            // "z-30": note.isPinned && !isTranslated,
          })}
          onAnimationComplete={onPopoverClosingComplete}
        >
          <NotePopoverWindow note={note} cardRef={cardRef}>
            <NoteCard note={note} cardRef={cardRef} {...cardProps} />
          </NotePopoverWindow>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
