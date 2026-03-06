import { Container } from "@/components/ui/layout/containers";

// ============================================================================
// Error State
// ============================================================================

export function LeadsPanelError({ message }: { message: string }) {
  return (
    <Container spacing="block" width="full" role="alert" aria-live="assertive">
      <p className="text-sm text-destructive">{message}</p>
    </Container>
  );
}
