import { cva } from "class-variance-authority";
import { SURFACE_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Card Variants
// ============================================================================

export const cardVariants = cva(
  "relative w-full rounded-(--card-rounding) flex flex-col",
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
        "background-blur": "surface-background-blur",
        "card-blur": "surface-card-blur",
        "popover-blur": "surface-popover-blur",
        "muted-blur": "surface-muted-blur",
        "panel-blur": "surface-panel-blur",
        "outline-blur": "border surface-outline-blur",
      },
      size: {
        none: "",
        sm: "px-card-x-sm py-card-y-sm gap-card-y-xs",
        md: "px-card-x-md py-card-y-md gap-card-y-sm",
        lg: "px-card-x-lg py-card-y-lg gap-card-y-md",
      },
      rounded: SURFACE_RADIUS_FIELD_RECORD,
    },

    defaultVariants: {
      size: "md",
      variant: "card",
      border: false,
      rounded: "lg",
    },
  },
);
