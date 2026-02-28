import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/controls";
import {
  PencilIcon,
  Trash2,
  Pin,
  PinOff,
  EllipsisVerticalIcon,
} from "lucide-react";
import { MorphingPopoverTrigger } from "@/components/motion-primitives/morphing-popover";
import { useNoteItemState } from "@/components/lead-details/relations/notes/providers/note-item-state-provider";

// ============================================================================
// Types
// ============================================================================

interface NoteDropdownProps {
  isPinned: boolean;
  togglePinned: () => void;
}

// ============================================================================
// PinMenuItem
// ============================================================================

const PinMenuItem = ({ isPinned, togglePinned }: NoteDropdownProps) => {
  return (
    <DropdownMenuItem
      onClick={togglePinned}
      variant={isPinned ? "brand" : "default"}
    >
      <>
        {isPinned ? <PinOff /> : <Pin />}
        {isPinned ? "Unpin" : "Pin"}
      </>
    </DropdownMenuItem>
  );
};

// ============================================================================
// EditMenuItem
// ============================================================================

const EditMenuItem = ({ onClick }: { onClick: () => void }) => {
  return (
    <MorphingPopoverTrigger asChild isLayoutTrigger={false}>
      <DropdownMenuItem onClick={onClick}>
        <PencilIcon />
        Edit
      </DropdownMenuItem>
    </MorphingPopoverTrigger>
  );
};

// ============================================================================
// DeleteMenuItem
// ============================================================================

const DeleteMenuItem = ({ onClick }: { onClick: () => void }) => {
  return (
    <MorphingPopoverTrigger asChild isLayoutTrigger={false}>
      <DropdownMenuItem variant="destructive" onClick={onClick}>
        <Trash2 />
        Delete
      </DropdownMenuItem>
    </MorphingPopoverTrigger>
  );
};

// ============================================================================
// NoteActionsMenu Component
// ============================================================================

const NoteDropdownMenu = ({ isPinned, togglePinned }: NoteDropdownProps) => {
  const { setPopoverContent, isTranslated } = useNoteItemState();

  const handleEdit = () => setPopoverContent("update");

  const handleDelete = () => setPopoverContent("delete");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          intent="ghost-text"
          mode="iconOnly"
          aria-label="More options"
          disabled={isTranslated}
        >
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <PinMenuItem isPinned={isPinned} togglePinned={togglePinned} />

          <EditMenuItem onClick={handleEdit} />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteMenuItem onClick={handleDelete} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NoteDropdownMenu };
