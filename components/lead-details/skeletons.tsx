import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/layout/containers";
import { DialogTitle } from "@/components/ui/feedback/dialog";

// ==========================================================================
// LeadHeaderSkeleton - Skeleton for the lead header.
// ==========================================================================

export const LeadHeaderSkeleton = () => {
  return (
    <Container spacing="block">
      <Container
        spacing="group"
        className="flex flex-row items-center justify-between"
      >
        <DialogTitle className="sr-only">Lead Details</DialogTitle>
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-8 w-48 mr-auto" />

        <Skeleton className="size-9 rounded-full" />
      </Container>
      <Container spacing="group">
        <Container
          spacing="item"
          className="flex flex-row items-center justify-between"
        >
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-28" />
        </Container>
        <Container spacing="item" className="flex flex-row items-center">
          {["0", "1", "2", "3"].map((tab) => (
            <Skeleton key={tab} className="h-11 w-full rounded-lg" />
          ))}
        </Container>
      </Container>
    </Container>
  );
};

// ==========================================================================
// LeadTabsSkeleton - Skeleton for the lead tabs.
// ==========================================================================

export const LeadTabsSkeleton = () => {
  return (
    <Container spacing="block">
      {["0", "1"].map((tab) => (
        <Container key={tab} spacing="group">
          <Skeleton className="h-8 w-24" />
          <Container spacing="item">
            <Skeleton className="h-36 w-full rounded-lg" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </Container>
        </Container>
      ))}
    </Container>
  );
};
