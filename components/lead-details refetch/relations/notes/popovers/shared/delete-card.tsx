"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/layout/card";
import { Button } from "@/components/ui/controls";
import { Trash2 } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";
import { usePopoverContext } from "@/components/motion-primitives/morphing-popover";
import { deleteLeadNoteAction } from "@/lib/server/actions/write/deleteLeadNoteAction";
import { toast } from "sonner";
import { useState } from "react";

// ============================================================================
// Types
// ============================================================================

interface DeleteCardProps {
  onClose: () => void;
  onSubmit: () => Promise<void>;
  deleteLabel: { deleting: string; default: string };
  title: string;
}

const DeleteCard = ({
  onClose,
  title,
  onSubmit,
  deleteLabel,
}: DeleteCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const context = usePopoverContext("DeleteCard");

  const closeMenu = () => {
    onClose();
    context?.close();
  };

  const handleDeleteNote = async () => {
    setIsDeleting(true);

    await onSubmit();

    setIsDeleting(false);
    closeMenu();
  };

  return (
    <Card
      variant="background"
      size="sm"
      border={true}
      role="alertdialog"
      aria-labelledby="delete-card-title"
      aria-describedby="delete-card-description"
    >
      <CardHeader>
        <CardTitle id="delete-card-title" className="max-lg:text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        id="delete-card-description"
        className="text-xs @lg:text-sm text-muted-foreground"
      >
        This action cannot be undone.
      </CardContent>
      <CardFooter>
        <Container
          key="close"
          spacing="group"
          className="flex flex-row items-center justify-between @lg:justify-end mt-card-y-xs"
        >
          <Button
            intent="outline"
            size="responsive-sm"
            // mode="iconOnly"

            onClick={closeMenu}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="responsive-sm"
            // mode="responsiveIcon"
            onClick={handleDeleteNote}
            disabled={isDeleting}
            aria-label={isDeleting ? deleteLabel.deleting : deleteLabel.default}
          >
            <Trash2 />
            {isDeleting ? deleteLabel.deleting : deleteLabel.default}
          </Button>
        </Container>
      </CardFooter>
    </Card>
  );
};

export { DeleteCard };
