"use client";
import { toast } from "sonner";
import { NoteForm } from "@/components/lead-details/relations/notes/shared/cards/note-form-card";
import { createLeadNoteAction } from "@/lib/server/actions/write/createLeadNoteAction";
import { useViewLeadDialog } from "@/components/dialogs/view-lead-dialog";
import {
  MorphingPopoverTrigger,
  MorphingPopoverContent,
} from "@/components/motion-primitives/morphing-popover";
import { PlusIcon } from "lucide-react";
import { ControlLabel } from "@/components/ui/controls";
import { AnimatePresence } from "motion/react";
import { Overlay } from "@/components/ui/feedback/overlay";
import { usePopoverContext } from "@/components/motion-primitives/morphing-popover";

const CreateNotePopover = () => {
  const { leadId, fetchRelations } = useViewLeadDialog();
  const context = usePopoverContext("CreateNotePopover");

  const handleCreateNote = async (newNote: string) => {
    try {
      const result = await createLeadNoteAction(leadId, newNote, "You");

      if (result.success) {
        fetchRelations();
        toast.success("Note added");
      } else {
        toast.error(result.error || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  return (
    <>
      <AnimatePresence>
        {context?.isOpen && (
          <Overlay className="z-10" transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>
      <MorphingPopoverTrigger intent="ghost" size="sm" mode="responsiveIcon">
        <PlusIcon />
        <ControlLabel>Add Note</ControlLabel>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        align="right"
        side="fromTop"
        className="w-full bg-transparent border-none z-50"
        onClickOutside={context?.close}
      >
        <NoteForm
          onClose={context?.close}
          onSubmit={handleCreateNote}
          placeholderLabel="Add Note"
          submitLabel={{ submitting: "Submitting...", default: "Submit" }}
        />
      </MorphingPopoverContent>
    </>
  );
};

export { CreateNotePopover };
