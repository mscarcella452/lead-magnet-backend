import { AlertCircle } from "lucide-react";
import {
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { Card, CardTitle, CardDescription } from "@/components/ui/layout/card";

// ============================================================================
// ViewLeadError
// ============================================================================

interface ViewLeadErrorProps {
  message?: string;
}

export function ViewLeadError({ message }: ViewLeadErrorProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="h-screen max-h-full flex flex-col relative"
    >
      <div className="absolute inset-0 dot-grid" />
      <DialogHeader className="px-dialog-x-md pt-dialog-y-md flex flex-row items-center justify-between">
        <span className="text-lg @lg:text-xl">View Lead</span>
        <DialogClose className="static" />
      </DialogHeader>

      <DialogBody className="px-dialog-x-md flex items-center justify-center flex-1">
        <Card
          variant="panel"
          border
          className="flex items-center max-w-[400px] "
        >
          <AlertCircle
            aria-hidden="true"
            className="size-10 @lg:size-12 text-destructive"
          />
          <Container spacing="item" className="text-center">
            <CardTitle className="text-lg @lg:text-xl">
              {message ?? "Failed to load lead."}
            </CardTitle>
            <CardDescription className="text-xs @lg:text-sm text-muted-foreground">
              Something went wrong. <br />
              Please try again or contact support.
            </CardDescription>
          </Container>
        </Card>
        {/* <Container
          spacing="block"
          className="my-auto place-items-center text-center"
        >
          <AlertCircle
            aria-hidden="true"
            className="size-10 @lg:size-12 text-destructive-text"
          />
          <Container spacing="item">
            <p className="text-lg @lg:text-xl font-semibold text-destructive-text">
              {message ?? "Failed to load lead"}
            </p>
            <p className="text-xs @lg:text-sm text-muted-foreground">
              Something went wrong. <br />
              Please try again or contact support.
            </p>
          </Container>
        </Container> */}
      </DialogBody>
    </div>
  );
}
