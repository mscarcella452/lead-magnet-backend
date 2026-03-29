"use client";

import { Note } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  type CardProps,
} from "@/components/ui/layout/card";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/layout/containers";
import { toast } from "sonner";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { NoteDropdownMenu } from "@/components/lead-details/view-lead/notes/shared/note-dropdown";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import { updateLeadNoteAction } from "@/lib/server/actions/write/updateLeadNoteAction";
import { useNoteItemState } from "@/components/lead-details/view-lead/notes/providers/note-item-state-provider";
import { NotePinButton } from "@/components/lead-details/view-lead/notes/shared/note-pin-button";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";
import { formatDate } from "@/lib/utils/dates";

// ============================================================================
// NoteCardHeader
// ============================================================================

function NoteCardHeader({ note }: { note: Note }) {
  const { leadId, dispatch } = useNotesContext();

  const formattedCreatedDate = formatDate(note.createdAt);

  const handleTogglePin = async () => {
    const action = note.isPinned ? "unpin" : "pin";

    // Snapshot original state for rollback
    const pinSnapshot: Pick<Note, "isPinned" | "pinnedAt"> = {
      isPinned: note.isPinned,
      pinnedAt: note.pinnedAt,
    };

    // Optimistically toggle pin state
    dispatch({
      type: "UPDATE",
      payload: {
        id: note.id,
        updates: {
          isPinned: !note.isPinned,
          pinnedAt: !note.isPinned ? new Date() : null,
        },
      },
    });

    try {
      const result = await updateLeadNoteAction({
        leadId,
        noteId: note.id,
        isPinned: !pinSnapshot.isPinned,
      });
      if (!result.success) {
        // Rollback on logical failure
        dispatch({
          type: "UPDATE",
          payload: {
            id: note.id,
            updates: pinSnapshot,
          },
        });
        toast.error(`Failed to ${action} note`);
        return;
      }
      invalidateLeadWithRelationsCache(leadId);
      toast.success(`Note ${action}ned`);
    } catch (error) {
      // Rollback on thrown error
      dispatch({
        type: "UPDATE",
        payload: {
          id: note.id,
          updates: pinSnapshot,
        },
      });
      console.error(`Error ${action}ing note:`, error);
      toast.error(`Failed to ${action} note`);
    }
  };

  return (
    <CardHeader className="flex flex-row items-baseline gap-2 text-xs relative mb-card-y-xs">
      <CardTitle className="font-medium">
        <span className="sr-only">Note by </span>
        {note.author}
      </CardTitle>
      <span className="text-caption" aria-hidden="true">
        •
      </span>
      <span className="text-muted-foreground">{formattedCreatedDate}</span>

      <Container
        spacing="group"
        width="fit"
        className="flex flex-row absolute right-0 inset-y-0"
      >
        {note.isPinned && <NotePinButton onClick={handleTogglePin} />}
        <NoteDropdownMenu
          isPinned={note.isPinned}
          togglePinned={handleTogglePin}
        />
      </Container>
    </CardHeader>
  );
}

// ============================================================================
// NoteCardFooter
// ============================================================================

function NoteCardFooter({ note }: { note: Note }) {
  if (!note.contentUpdatedAt) return null;

  const formattedContentUpdatedDate = formatDate(note.contentUpdatedAt);

  return (
    <CardFooter className="gap-2 text-caption mt-card-y-sm">
      <span>Last updated by {note.updatedBy}</span>
      <span aria-hidden="true">•</span>
      <span>{formattedContentUpdatedDate}</span>
    </CardFooter>
  );
}

// ============================================================================
// NoteCard
// ============================================================================

interface NoteCardProps extends CardProps {
  note: Note;
  cardRef: React.RefObject<HTMLDivElement>;
}

export function NoteCard({ note, cardRef, ...props }: NoteCardProps) {
  const { isOpen, isTranslated } = useNoteItemState();
  const { className, ...rest } = props;
  return (
    <LayoutGroup id={`note-card-${note.id}`}>
      <Card
        ref={cardRef}
        size="sm"
        variant={isOpen ? "muted" : "card"}
        className={cn(
          "group relative transition-colors gap-0!",
          // z-50 on isTranslated is so card stays above the delete or update popover.
          // This way popover can tuck in nicely behind it on close.
          { "z-50": isTranslated, "text-muted-foreground!": isOpen },
          className,
        )}
        {...rest}
      >
        <motion.div layout>
          <NoteCardHeader note={note} />
        </motion.div>
        <motion.div layout key={note.content}>
          <CardContent className="text-xs @lg:text-sm leading-relaxed whitespace-pre-wrap">
            {note.content}
          </CardContent>
        </motion.div>

        <AnimatePresence initial={false}>
          {note.contentUpdatedAt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={CARD_MOTION_TRANSITION}
            >
              <NoteCardFooter note={note} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </LayoutGroup>
  );
}
