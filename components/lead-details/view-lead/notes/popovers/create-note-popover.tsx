"use client";
import { toast } from "sonner";
import { NoteFormCard } from "@/components/lead-details/view-lead/notes/popovers/shared/note-form-card";
import { createLeadNoteAction } from "@/lib/server/actions/write/createLeadNoteAction";
import { useNotesContext } from "@/components/lead-details/view-lead/notes/providers/notes-context-provider";
import { usePopoverContext } from "@/components/ui/controls/morphing-popover";
import { invalidateLeadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";
import {
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/controls/morphing-popover";
import { PlusIcon } from "lucide-react";
import { ControlLabel } from "@/components/ui/controls";

// ============================================================
// CreateNotePopover
// ============================================================

const CreateNotePopover = () => {
  const { leadId, dispatch } = useNotesContext();
  const context = usePopoverContext("CreateNotePopover");

  const handleClose = () => context?.close();

  const handleCreateNote = async (content: string) => {
    try {
      const result = await createLeadNoteAction(leadId, content, "You");
      if (!result.success) {
        toast.error(result.error || "Failed to add note");
        return;
      }
      dispatch({ type: "ADD", payload: result.data });
      invalidateLeadWithRelationsCache(leadId);
      toast.success("Note added");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      handleClose();
    }
  };

  return (
    <>
      <MorphingPopoverTrigger intent="ghost" size="sm" mode="responsiveIcon">
        <PlusIcon />
        <ControlLabel>Add Note</ControlLabel>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        align="right"
        side="fromTop"
        className="w-full bg-transparent border-none z-50"
        onClickOutside={handleClose}
      >
        <NoteFormCard
          onSubmit={handleCreateNote}
          placeholderLabel="Add Note"
          submitLabel="Submit"
        />
      </MorphingPopoverContent>
    </>
  );
};

export { CreateNotePopover };
