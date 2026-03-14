import { memo } from "react";
import { TableHead } from "@/components/ui/layout/table";
import { Button } from "@/components/ui/controls";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/classnames";
import type { SortableHeaderProps } from "@/components/leads/table/lib/types";

// ============================================================================
// Sortable Header Component
// ============================================================================

export const SortableHeader = memo(function SortableHeader({
  field,
  label,
  onSort,
  sortBy,
  sortOrder,
}: SortableHeaderProps) {
  const isActive = sortBy === field;
  const isAscending = isActive && sortOrder === "asc";

  return (
    <TableHead
      scope="col"
      aria-sort={isActive ? (isAscending ? "ascending" : "descending") : "none"}
    >
      <Button
        intent="ghost"
        size="xs"
        onClick={() => onSort?.(field)}
        aria-label={`Sort by ${label}${isActive ? `, currently ${sortOrder}ending` : ""}`}
      >
        {label}
        <ArrowUpDown
          aria-hidden="true"
          className={cn("transition-transform", isAscending && "rotate-180")}
        />
      </Button>
    </TableHead>
  );
});
