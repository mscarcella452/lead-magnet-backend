import { cva } from "class-variance-authority";
import { SURFACE_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";
import { DIALOG_LAYOUT_VARIANTS } from "@/design-system/presets/dialog-presets";

// ============================================================================
// AlertDialog Variants
// ============================================================================

export const alertDialogVariants = cva(
  [DIALOG_LAYOUT_VARIANTS.modal, "max-w-lg"],
  {
    variants: {
      variant: {
        background: "surface-background",
        card: "surface-card",
        popover: "surface-popover",
        panel: "surface-panel",
      },

      spacing: {
        none: "",
        sm: "px-dialog-x-sm py-dialog-y-sm space-y-dialog-y-xs",
        md: "px-dialog-x-md py-dialog-y-md space-y-dialog-y-sm",
        lg: "px-dialog-x-lg py-dialog-y-lg space-y-dialog-y-md",
      },

      rounded: SURFACE_RADIUS_FIELD_RECORD,
      border: {
        true: "border",
        false: "",
      },
    },

    defaultVariants: {
      rounded: "lg",
      border: true,
      spacing: "md",
      variant: "background",
    },
  },
);
