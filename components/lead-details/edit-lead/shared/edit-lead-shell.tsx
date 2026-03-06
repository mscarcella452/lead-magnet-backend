import {
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";

// ============================================================================
// Edit Lead Shell
// ============================================================================

// Shared layout shells for EditLead dialog states (details, skeleton, error).
// Wraps DialogHeader, DialogBody, and DialogFooter with consistent classes and spacing.

export function EditLeadHeader({ children }: { children: React.ReactNode }) {
  return (
    <DialogHeader className="px-dialog-x-md pt-dialog-y-md flex flex-row justify-between items-center sticky top-0 z-10 bg-background-blur pb-dialog-y-sm">
      {children}
    </DialogHeader>
  );
}

export function EditLeadBody({ children }: { children: React.ReactNode }) {
  return (
    <DialogBody className="px-dialog-x-md">
      <Container spacing="content">{children}</Container>
    </DialogBody>
  );
}

export function EditLeadFooter({ children }: { children: React.ReactNode }) {
  return (
    <DialogFooter className="sticky bg-background-blur bottom-0 px-dialog-x-md pb-dialog-y-md pt-dialog-y-sm">
      <Container
        spacing="block"
        className="flex-col-reverse @lg:flex-row @lg:justify-end"
      >
        {children}
      </Container>
    </DialogFooter>
  );
}
