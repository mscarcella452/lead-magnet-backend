import { cva } from "class-variance-authority";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Select Trigger CVA Variants
// ============================================================================
export const selectTriggerVariants = cva(
  [
    "px-3 py-1",
    "flex w-full items-center justify-between [&>span]:line-clamp-1",
    // "disabled:pointer-events-none disabled:opacity-70",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      border: {
        true: "border",
        false: "",
      },
      variant: {
        background: "surface-background",
        card: "surface-card",
        popover: "surface-popover",
        muted: "surface-muted",
        panel: "surface-panel",
        outline: "border surface-outline",
        input: "surface-input",
      },

      size: {
        xs: "h-compact-h-lg control-text-sm",
        sm: "h-control-h-sm control-text-sm",
        md: "h-control-h-md control-text-md",
        lg: "h-control-h-lg control-text-lg",
        "responsive-sm": [
          "@max-lg:h-compact-h-lg",
          "h-control-h-sm control-text-sm",
        ],
        "responsive-md": [
          "@max-lg:h-control-h-sm  @max-lg:control-text-sm",
          "h-control-h-md control-text-md",
        ],
        "responsive-lg": [
          "@max-lg:h-control-h-md @max-lg:control-text-md",
          "h-control-h-lg control-text-lg",
        ],
      },

      radius: CONTROL_RADIUS_FIELD_RECORD,
    },

    defaultVariants: {
      size: "md",
      radius: "rounded",
      border: true,
      variant: "input",
    },
  },
);
