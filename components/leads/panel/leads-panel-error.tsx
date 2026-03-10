import { Container } from "@/components/ui/layout/containers";
import { AlertCircle } from "lucide-react";

// ============================================================================
// Error State
// ============================================================================

export function LeadsPanelError({ message }: { message: string }) {
  return (
    <Container
      spacing="group"
      width="full"
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center  py-12 px-6 rounded-lg bg-destructive/5 border border-destructive/10! "
    >
      <AlertCircle className="size-10 text-destructive-text" />

      <p className="text-lg font-medium text-destructive-text">{message}</p>
    </Container>
  );
}
