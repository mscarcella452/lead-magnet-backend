import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils";

// ============================================================================
// Shared constants
// ============================================================================
const ROW_COUNT = 10;
const COL_COUNT = 6;
const PAGINATION_COUNT = 5;

// ============================================================================
// Shared primitives
// ============================================================================
function CheckboxSkeleton() {
  return <Skeleton className="size-4 rounded-sm shrink-0" />;
}

interface SkeletonRowProps {
  isHeader?: boolean;
}

function ColumnGroupSkeleton({ isHeader = false }: SkeletonRowProps) {
  return (
    <Container
      spacing="block"
      position="start"
      className="flex flex-row items-center justify-between"
    >
      {Array.from({ length: COL_COUNT }, (_, i) => {
        const isLast = i === COL_COUNT - 1;
        return (
          <Skeleton
            key={i}
            className={cn({
              "h-control-h-sm": isHeader,
              "h-compact-h-sm": !isHeader,
              "w-24": !isLast,
              "w-12 shrink-0": isLast && isHeader,
              "ml-4 w-8 shrink-0": isLast && !isHeader,
            })}
          />
        );
      })}
    </Container>
  );
}

function TableRowLayout({
  isHeader = false,
  className,
}: SkeletonRowProps & { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 px-4 py-3", className)}>
      <CheckboxSkeleton />
      <ColumnGroupSkeleton isHeader={isHeader} />
    </div>
  );
}

// ============================================================================
// Composed skeletons
// ============================================================================
function TableHeaderSkeleton() {
  return (
    <Container spacing="item" position="start">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-4 w-48" />
    </Container>
  );
}

function TableSkeleton() {
  return (
    <div
      className="rounded-md border overflow-hidden"
      role="status"
      aria-label="Loading leads"
      aria-busy="true"
    >
      <TableRowLayout isHeader className="border-b bg-muted/40" />
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <TableRowLayout key={i} className="border-b last:border-0" />
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      {Array.from({ length: PAGINATION_COUNT + 2 }, (_, i) => (
        <Skeleton key={i} className="h-8 w-8 rounded-md" />
      ))}
    </div>
  );
}

// ============================================================================
// LeadsPanelSkeleton
// ============================================================================
export function LeadsPanelSkeleton() {
  return (
    <Container spacing="block" width="full" aria-label="Leads panel loading">
      <TableHeaderSkeleton />
      <TableSkeleton />
      <PaginationSkeleton />
      <span className="sr-only">Loading leads, please wait</span>
    </Container>
  );
}
