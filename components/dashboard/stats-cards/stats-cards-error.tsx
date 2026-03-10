import { Card } from "@/components/ui/layout/card";
import { AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";

// ============================================================================
// StatsCardsError
// ============================================================================

export function StatsCardsError({ message }: { message: string }) {
  return (
    <Card
      size="md"
      variant="panel"
      border={true}
      className="w-full"
      role="alert"
      aria-live="assertive"
    >
      <Container
        spacing="item"
        className="flex flex-row items-center  text-sm text-destructive-text"
      >
        <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
        <p>{message}</p>
      </Container>
    </Card>
  );
}
