"use client";
import { MorphingPopover } from "@/components/ui/controls/morphing-popover";
import { AnimatePresence } from "motion/react";
import { Overlay } from "@/components/ui/feedback/overlay";
import { useState } from "react";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";

// ============================================================================
// CreateNotePopoverWindow
// ============================================================================

export function CreateNotePopoverWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);

  const onOpenChange = (open: boolean) => setIsCreateNoteOpen(open);

  return (
    <MorphingPopover
      open={isCreateNoteOpen}
      onOpenChange={onOpenChange}
      transition={CARD_MOTION_TRANSITION}
    >
      <AnimatePresence>
        {isCreateNoteOpen && (
          <Overlay className="z-10" transition={CARD_MOTION_TRANSITION} />
        )}
      </AnimatePresence>
      {children}
    </MorphingPopover>
  );
}
