import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Container } from "@/components/ui/layout/containers";
import {
  EditLeadHeader,
  EditLeadBody,
  EditLeadFooter,
} from "@/components/lead-details/edit-lead/shared/edit-lead-shell";

// ============================================================================
// Field Skeleton — single label + input row
// ============================================================================

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

// ============================================================================
// Section Skeleton — label + a few fields
// ============================================================================

function SectionSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-3.5 w-32" />
      {Array.from({ length: fields }, (_, i) => (
        <FieldSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// EditLeadSkeleton
// ============================================================================

export function EditLeadSkeleton() {
  return (
    <Container
      spacing="block"
      role="status"
      aria-label="Loading lead details"
      aria-busy="true"
    >
      <EditLeadHeader>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-40" />
      </EditLeadHeader>

      <EditLeadBody>
        {/* Summary block */}
        <SectionSkeleton fields={1} />
        {/* Detail sections */}
        <SectionSkeleton fields={3} />
        <SectionSkeleton fields={3} />
      </EditLeadBody>

      <EditLeadFooter>
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </EditLeadFooter>

      <span className="sr-only">Loading lead details, please wait</span>
    </Container>
  );
}
