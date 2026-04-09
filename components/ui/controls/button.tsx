import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/classnames";
import { controlVariants } from "@/design-system/cva-variants/control-variants";
import { ControlVariantProps } from "@/design-system/types/cva-types";

// ============================================================================
// Control Label Component
// ============================================================================
// Wrapper component for button/link labels that need to be hidden on mobile
// when using mode="responsiveIcon"

const ControlLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="control-label">{children}</span>
);

// ============================================================================
// Button Props
// ============================================================================

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ControlVariantProps {
  /** When true, Button will render as a Slot component for composition patterns */
  asChild?: boolean;
}

// ============================================================================
// Button Component
// ============================================================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
          controlVariants({
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

Button.displayName = "Button";

// ============================================================================
// Exports
// ============================================================================

export { Button, ControlLabel, type ButtonProps };
