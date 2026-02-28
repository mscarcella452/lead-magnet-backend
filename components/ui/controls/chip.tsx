import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/classnames";
import { chipVariants } from "@/design-system/cva-variants/chip-variants";
import { ChipVariantProps } from "@/design-system/lib/types/cva-types";
import { validateResponsiveIcon } from "@/design-system/lib/helpers/validation";
import { ControlLabel } from "@/components/ui/controls/button"; // Import from Button

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
    // ========================================================================
    // Development Validation
    // ========================================================================
    // Validate that responsiveIcon mode has the required ControlLabel child

    if (
      process.env.NODE_ENV === "development" &&
      mode === "responsiveIcon" &&
      !asChild
    ) {
      const error = validateResponsiveIcon(props.children);
      if (error) console.warn(`Chip: ${error}`);
    }

    // ========================================================================
    // Render
    // ========================================================================

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
