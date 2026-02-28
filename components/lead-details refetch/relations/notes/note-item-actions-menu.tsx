import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/controls";
import {
  PencilIcon,
  Trash2,
  Pin,
  PinOff,
  EllipsisVerticalIcon,
  Ellipsis,
} from "lucide-react";
import { MorphingPopoverTrigger } from "@/components/motion-primitives/morphing-popover";
import { NoteState } from "@/components/lead-details/relations/notes/note-item";

// ============================================================================
// Types
// ============================================================================

interface NoteActionsMenuProps {
  isPinned: boolean;
  togglePinned: () => void;
  setPopoverContent: (content: NoteState["popoverContent"]) => void;
  disabled?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

// ============================================================================
// Menu Items Components
// ============================================================================

const PinMenuItem = ({
  isPinned,
  togglePinned,
}: {
  isPinned: boolean;
  togglePinned: () => void;
}) => {
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

const NoteItemActionsMenu = ({
  isPinned,
  togglePinned,
  setPopoverContent,
  disabled,
}: NoteActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          intent="ghost-text"
          mode="iconOnly"
          aria-label="More options"
          disabled={disabled}
        >
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <PinMenuItem isPinned={isPinned} togglePinned={togglePinned} />

          <EditMenuItem onClick={() => setPopoverContent("update")} />
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteMenuItem onClick={() => setPopoverContent("delete")} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NoteItemActionsMenu };
