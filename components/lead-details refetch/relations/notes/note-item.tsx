"use client";

import { Note } from "@prisma/client";
import { formatDate } from "@/lib/utils/dates";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/layout/card";
import { useState } from "react";
import { ComponentProps } from "react";
import { Button } from "@/components/ui/controls";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/layout/containers";
import { motion, AnimatePresence } from "motion/react";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverAnchor,
} from "@/components/motion-primitives/morphing-popover";

import { toast } from "sonner";

import { Overlay } from "@/components/ui/feedback/overlay";
import { useViewLeadDialog } from "@/components/dialogs/view-lead-dialog";
import { useRef } from "react";

import { NoteItemActionsMenu } from "@/components/lead-details/relations/notes/shared/note-dropdown";
import { DeleteNotePopover } from "@/components/lead-details/relations/notes/popovers/delete-note-popover";
import { UpdateNotePopover } from "@/components/lead-details/relations/notes/popovers/update-note-popover";

// ============================================================================
// getTranslateYToCenter Helper
// ============================================================================

type CenteringOptions = {
  targetRect: DOMRect;
  containerRect?: DOMRect | null;
};

export function getTranslateYToCenter({
  targetRect,
  containerRect,
}: CenteringOptions) {
  const containerCenter = containerRect
    ? containerRect.top + containerRect.height * 0.5
    : window.innerHeight * 0.5;

  const targetCenter = targetRect.top + targetRect.height * 0.5;

  return Math.round(-(targetCenter - containerCenter));
}

// ============================================================================
// Types
// ============================================================================

interface NoteItemProps extends ComponentProps<typeof Card> {
  relation: Note;
  className?: string;
}

enum NoteViewState {
  RESTING, // normal card in list
  OPENING, // moving to center
  OPEN, // popover open, card elevated
  CLOSING, // popover closing, card returning
}

export type NoteState = {
  viewState: NoteViewState;
  translateY: number;
  popoverContent: "update" | "delete";
};

function NoteItem({
  relation: note,
  className,

  ...props
}: NoteItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    viewLeadContentRef: dialogContentRef,
    leadId,
    fetchRelations,
  } = useViewLeadDialog();

  const [noteState, setNoteState] = useState<NoteState>({
    viewState: NoteViewState.RESTING,
    translateY: 0,
    popoverContent: "update",
  });
  const [isPinned, setIsPinned] = useState(false);
  const isOpen =
    noteState.viewState === NoteViewState.OPEN ||
    noteState.viewState === NoteViewState.OPENING;
  const isTranslated = noteState.viewState !== NoteViewState.RESTING;

  const closeMenu = () => {
    setNoteState((prev) => ({ ...prev, viewState: NoteViewState.CLOSING }));

    setTimeout(() => {
      setNoteState((prev) => ({ ...prev, viewState: NoteViewState.RESTING }));
    }, 400);
  };

  const setPopoverContent = (content: NoteState["popoverContent"]) => {
    setNoteState((prev) => ({ ...prev, popoverContent: content }));
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeMenu();
      return;
    }

    if (!cardRef.current) return;

    const translateY = getTranslateYToCenter({
      targetRect: cardRef.current.getBoundingClientRect(),
      containerRect: dialogContentRef?.current?.getBoundingClientRect(),
    });

    setNoteState((prev) => ({
      ...prev,
      translateY,
      viewState: NoteViewState.OPENING,
    }));
  };

  const togglePinned = () => {
    setIsPinned((prev) => !prev);
    toast(isPinned ? "Note unpinned" : "Note pinned");
  };

  const formattedCreatedDate = formatDate(note.createdAt);
  const formattedUpdatedDate = formatDate(note.updatedAt);

  const hasBeenUpdated = formattedCreatedDate !== formattedUpdatedDate;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            className={cn("z-10", {
              "cursor-default": noteState.popoverContent === "delete",
            })}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={isOpen ? { y: noteState.translateY } : { y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("origin-top w-full", {
          "z-50": isTranslated,
        })}
      >
        <MorphingPopover open={isOpen} onOpenChange={onOpenChange}>
          <MorphingPopoverAnchor />
          <Card
            ref={cardRef}
            size="sm"
            variant={isOpen ? "muted" : "card"}
            // border={isOpen ? true : false}
            className={cn(
              "group overflow-hidden relative transition-colors",
              {
                "z-50": isTranslated,
              },

              className,
            )}
            {...props}
          >
            <CardHeader className="flex flex-row items-baseline gap-2 text-xs relative ">
              <CardTitle className="sr-only">note #{note.id}</CardTitle>
              <span className="font-medium text-foreground">{note.author}</span>
              <span className="text-caption" aria-hidden="true">
                •
              </span>
              <span className="text-muted-foreground">
                {formattedCreatedDate}
              </span>

              <Container
                spacing="group"
                width="fit"
                className="flex flex-row  absolute right-0 inset-y-0"
              >
                <AnimatePresence mode="wait">
                  {isPinned && (
                    <motion.div
                      initial={{ y: -2, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -2, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotePinButton onUnpin={togglePinned} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <NoteItemActionsMenu
                  isPinned={isPinned}
                  togglePinned={togglePinned}
                  setPopoverContent={setPopoverContent}
                  disabled={isTranslated}
                />
              </Container>
            </CardHeader>

            <CardContent
              className={cn(
                "text-xs @lg:text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-300",
                {
                  "text-muted-foreground": isOpen,
                },
              )}
            >
              {note.content}
            </CardContent>
            {hasBeenUpdated && (
              <CardFooter className="mt-card-y-xs gap-2 text-caption">
                <span>Last updated by {note.author}</span>
                <span aria-hidden="true">•</span>
                <span>{formatDate(note.updatedAt)}</span>
              </CardFooter>
            )}
          </Card>
          <MorphingPopoverContent
            side={noteState.translateY > 0 ? "bottom" : "top"}
            className="w-full bg-transparent border-none"
            disableClickOutside={noteState.popoverContent === "delete"}
          >
            {noteState.popoverContent === "update" ? (
              <UpdateNotePopover
                note={note}
                onClose={closeMenu}
                leadId={leadId}
                fetchRelations={fetchRelations}
              />
            ) : (
              <DeleteNotePopover
                leadId={leadId}
                noteId={note.id}
                fetchRelations={fetchRelations}
              />
            )}
          </MorphingPopoverContent>
        </MorphingPopover>
      </motion.div>
    </>
  );
}

export { NoteItem };

interface NotePinButtonProps {
  onUnpin: () => void;
  className?: string;
}

export function NotePinButton({ onUnpin, className }: NotePinButtonProps) {
  return (
    <Button
      variant="brand"
      intent="ghost-text"
      mode="iconOnly"
      className={cn("relative text-brand-text!", className)}
      aria-label="Unpin note"
      onClick={onUnpin}
    >
      <motion.span
        initial="rest"
        whileHover="hover"
        transition={{ duration: 0.2 }}
      >
        <Pin />
        <motion.span
          className="absolute inset-0 text-brand-text pointer-events-none"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
        >
          <PinOff />
        </motion.span>
      </motion.span>
    </Button>
  );
}
