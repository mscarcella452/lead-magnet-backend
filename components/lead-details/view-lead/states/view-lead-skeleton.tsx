// Skeleton for the ViewLead drawer — mirrors the structure of ViewLeadDialog
// with LeadHeader and LeadTabs placeholders to prevent layout shift on load.

import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Container } from "@/components/ui/layout/containers";
import {
  ViewLeadHeader,
  ViewLeadBody,
} from "@/components/lead-details/view-lead/shared/view-lead-shell";

// ============================================================================
// HeaderSkeleton
// ============================================================================

function HeaderSkeleton() {
  return (
    <ViewLeadHeader>
      <Container
        spacing="group"
        className="flex flex-row items-center justify-between"
      >
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-8 w-48 mr-auto" />

        <Skeleton className="size-9 rounded-full" />
      </Container>
      <Container spacing="group">
        <Container
          spacing="item"
          className="flex flex-row items-center justify-between"
        >
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-28" />
        </Container>
        <Container spacing="item" className="flex flex-row items-center">
          {["0", "1", "2", "3"].map((tab) => (
            <Skeleton key={tab} className="h-11 w-full rounded-lg" />
          ))}
        </Container>
      </Container>
    </ViewLeadHeader>
  );
}

// ============================================================================
// TabsSkeleton
// ============================================================================

function TabsSkeleton() {
  return (
    <ViewLeadBody>
      {Array.from({ length: 2 }, (_, i) => (
        <Container key={i} spacing="group">
          {i === 0 ? (
            <Container
              spacing="item"
              className="flex flex-row justify-between items-center"
            >
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-20" />
            </Container>
          ) : (
            <Skeleton className="h-8 w-24" />
          )}
          <Container spacing="item">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </Container>
        </Container>
      ))}
    </ViewLeadBody>
  );
}

// ============================================================================
// ViewLeadSkeleton
// ============================================================================

export function ViewLeadSkeleton() {
  return (
    <div role="status" aria-label="Loading lead details" aria-busy="true">
      <HeaderSkeleton />

      <TabsSkeleton />

      <span className="sr-only">Loading lead details, please wait</span>
    </div>
  );
}
