import { DialogHeader, DialogBody } from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";

// ============================================================================
// View Lead Shell
// ============================================================================

// Shared layout shells for ViewLead dialog states (details, skeleton, error).
// Wraps DialogHeader and DialogBody with consistent classes and spacing.

export function ViewLeadHeader({ children }: { children: React.ReactNode }) {
  return (
    <DialogHeader className="px-dialog-x-md pt-dialog-y-md pb-dialog-y-sm sticky top-0 z-10 surface-background-blur border-b border-card">
      <Container spacing="content">{children}</Container>
    </DialogHeader>
  );
}

export function ViewLeadBody({ children }: { children: React.ReactNode }) {
  return (
    <DialogBody className="px-dialog-x-md pt-dialog-y-sm pb-dialog-y-md">
      <Container spacing="content">{children}</Container>
    </DialogBody>
  );
}
