import { Card } from "@/components/ui/layout/card";

import { Container } from "@/components/ui/layout/containers";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { GRID_CLASS } from "@/components/dashboard/stats-cards/lib/constants";

// ============================================================================
// StatsCardsSkeleton
// ============================================================================

export function StatsCardsSkeleton() {
  return (
    <Container
      spacing="group"
      width="full"
      className={GRID_CLASS}
      role="status"
      aria-label="Loading statistics"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} size="md" variant="card">
          <Container
            spacing="group"
            className="flex flex-row items-center justify-between"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4 rounded-sm" />
          </Container>

          <Container
            spacing="group"
            className="@5xl:mt-4 flex flex-row justify-between items-center"
          >
            <Skeleton className="size-8 @5xl:size-10" />

            <Skeleton className="h-compact-h-sm w-14" />
          </Container>
        </Card>
      ))}
    </Container>
  );
}
