import { cva } from "class-variance-authority";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Input CVA Variants
// ============================================================================
export const inputVariants = cva(
  [
    "bg-input border border-border w-full justify-start text-foreground",
    "px-3 py-1",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
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
    },
  },
);
