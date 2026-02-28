import { cva } from "class-variance-authority";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Avatar CVA Variants
// ============================================================================
export const avatarVariants = cva(
  "",

  {
    variants: {
      size: {
        none: "",
        xs: "size-compact-h-lg control-text-sm",
        sm: "size-control-h-sm control-text-sm",
        md: "size-control-h-md control-text-md",
        lg: "size-control-h-lg control-text-lg",
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
