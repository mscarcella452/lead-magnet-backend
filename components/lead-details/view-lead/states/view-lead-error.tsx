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
// ViewLeadError
// ============================================================================

interface ViewLeadErrorProps {
  message: string;
}

export function ViewLeadError({ message }: ViewLeadErrorProps) {
  const { closeDialog } = useDialogs();

  return (
    <div role="alert" aria-live="assertive" className="h-screen flex flex-col">
      <DialogHeader className="px-dialog-x-md pt-dialog-y-md">
        <span className="text-lg @lg:text-xl">View Lead</span>
        <DialogClose />
      </DialogHeader>

      <DialogBody className="px-dialog-x-md flex flex-1">
        <Container
          spacing="block"
          className="flex flex-col items-center justify-center text-center"
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
        <Button
          type="button"
          size="sm"
          onClick={closeDialog}
          className="@max-lg:h-11 w-full"
        >
          Close
        </Button>
      </DialogFooter>
    </div>
  );
}
