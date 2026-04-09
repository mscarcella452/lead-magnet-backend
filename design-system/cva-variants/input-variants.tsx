import { cva } from "class-variance-authority";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Input CVA Variants
// ============================================================================
export const inputVariants = cva(
  [
    "surface-input border w-full justify-start text-foreground",
    "px-3 py-1",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    "placeholder:text-muted-foreground",
    "disabled:cursor-not-allowed disabled:text-subtle-foreground",
  ],
  {
    variants: {
      variant: {
        default: "",
        "text-area": "h-auto min-h-[80px] resize-y",
      },
      focus: {
        default:
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "input-group":
          "has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring",
        none: "focus-visible:outline-none focus-visible:ring-0",
      },
      size: {
        xs: "h-compact-h-lg control-text-sm",
        sm: "h-control-h-sm control-text-sm",
        md: "h-control-h-md control-text-md",
        lg: "h-control-h-lg control-text-md",
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
          "h-control-h-lg control-text-md",
        ],
      },

      radius: CONTROL_RADIUS_FIELD_RECORD,
    },

    defaultVariants: {
      size: "md",
      radius: "rounded",
      focus: "default",
      variant: "default",
    },
  },
);
