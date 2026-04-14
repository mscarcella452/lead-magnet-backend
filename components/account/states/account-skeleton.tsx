import { Container } from "@/components/ui/layout/containers";
import { Skeleton } from "@/components/ui/feedback/skeleton";

// ============================================================================
// AccountSkeleton
// ============================================================================

export function AccountSkeleton() {
  return (
    <Container spacing="section" className="grid grid-cols-3">
      <Skeleton className="@max-3xl:hidden w-56  h-40 shadow-xs " />
      <Container spacing="content" className="col-span-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-72 w-full @3xl:hidden" />
      </Container>
    </Container>
  );
}
