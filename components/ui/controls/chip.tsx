import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/classnames";
import { chipVariants } from "@/design-system/cva-variants/chip-variants";
import { ChipVariantProps } from "@/design-system/types/cva-types";

// ============================================================================
// Chip Props
// ============================================================================

interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ChipVariantProps {
  /** When true, Chip will render as a Slot component for composition patterns */
  asChild?: boolean;
}

// ============================================================================
// Chip Component
// ============================================================================
// Small interactive tag/badge component with button-like styling variants

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      intent,
      size,
      radius,
      mode,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // Use Slot for composition pattern (asChild), otherwise render as button
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          chipVariants({
            variant,
            intent,
            size,
            radius,
            mode,
          }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Chip.displayName = "Chip";

// ============================================================================
// Exports
// ============================================================================

export { Chip, type ChipProps };
