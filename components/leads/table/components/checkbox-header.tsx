import { memo } from "react";
import { TableHead } from "@/components/ui/layout/table";
import { Checkbox } from "@/components/ui/controls/checkbox";
import type { CheckboxHeaderProps } from "@/components/leads/table/lib/types";

// ============================================================================
// Checkbox Header Component
// ============================================================================

export const CheckboxHeader = memo(function CheckboxHeader({
  checked,
  indeterminate,
  onToggle,
}: CheckboxHeaderProps) {
  return (
    <TableHead className="w-12" scope="col">
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={onToggle}
        aria-label={
          indeterminate
            ? "Some leads selected, click to deselect all"
            : checked
              ? "All leads selected, click to deselect all"
              : "Select all leads"
        }
      />
    </TableHead>
  );
});
