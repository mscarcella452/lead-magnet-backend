import { AlertCircle } from "lucide-react";
import {
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { Button } from "@/components/ui/controls";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";

// ============================================================================
// EditLeadError
// ============================================================================

interface EditLeadErrorProps {
  message: string;
}

export function EditLeadError({ message }: EditLeadErrorProps) {
  const { closeDialog } = useDialogs();

  return (
    <div role="alert" aria-live="assertive">
      <DialogHeader className="px-dialog-x-md pt-dialog-y-md">
        <span className="text-lg @lg:text-xl">Edit Lead</span>
        <DialogClose />
      </DialogHeader>

      <DialogBody className="px-dialog-x-md">
        <Container
          spacing="block"
          className="flex flex-col items-center justify-center text-center min-h-[30vh]"
        >
          <AlertCircle
            aria-hidden="true"
            className="size-10 text-destructive-text"
          />
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium text-destructive-text">
              Failed to load lead
            </p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </Container>
      </DialogBody>

      <DialogFooter className="px-dialog-x-md pb-dialog-y-md pt-dialog-y-sm">
        <Container
          spacing="block"
          className="flex-col-reverse @lg:flex-row @lg:justify-end"
        >
          <Button
            type="button"
            size="sm"
            onClick={closeDialog}
            className="@max-lg:h-11"
          >
            Close
          </Button>
        </Container>
      </DialogFooter>
    </div>
  );
}
