import * as React from "react";
import { cn } from "@/lib/utils/classnames";
import { badgeVariants } from "@/design-system/cva-variants/badge-variants";
import { BadgeVariantProps } from "@/design-system/types/cva-types";

// ============================================================================
// Badge Props
// ============================================================================

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, BadgeVariantProps {}

// ============================================================================
// Badge Component
// ============================================================================
// Non-interactive label for status, categories, or counts

function Badge({
  className,
  variant,
  intent,
  size,
  radius,
  mode,
  ...props
}: BadgeProps) {
  const { children, ...restProps } = props;
  return (
    <div
      className={cn(
        badgeVariants({ variant, intent, size, radius, mode }),
        className,
      )}
      {...restProps}
    >
      <span className="truncate flex items-center justify-center gap-1">
        {children}
      </span>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { Badge, type BadgeProps };
