import { cva } from "class-variance-authority";
import { SURFACE_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";
import { DIALOG_LAYOUT_VARIANTS } from "@/design-system/presets/dialog-presets";

// ============================================================================
// Dialog Layout Variants
// ============================================================================

export const dialogLayoutVariants = cva("relative  w-full", {
  variants: {
    layout: {
      modal: [DIALOG_LAYOUT_VARIANTS.modal, "max-w-screen"],
      responsiveModal: [DIALOG_LAYOUT_VARIANTS.responsiveModal, "max-w-screen"],
      drawer: "",
      screen: DIALOG_LAYOUT_VARIANTS.screen,
    },

    enterFrom: {
      top: "",
      bottom: "",
      left: "",
      right: "",
    },

    rounded: SURFACE_RADIUS_FIELD_RECORD,
    border: {
      true: "border",
      false: "",
    },
  },

  compoundVariants: [
    // drawer positions
    {
      layout: "drawer",
      enterFrom: "bottom",
      className: DIALOG_LAYOUT_VARIANTS.drawer.bottom,
    },
    {
      layout: "drawer",
      enterFrom: "top",
      className: DIALOG_LAYOUT_VARIANTS.drawer.top,
    },
    {
      layout: "drawer",
      enterFrom: "left",
      className: DIALOG_LAYOUT_VARIANTS.drawer.left,
    },
    {
      layout: "drawer",
      enterFrom: "right",
      className: DIALOG_LAYOUT_VARIANTS.drawer.right,
    },
  ],

  defaultVariants: {
    layout: "modal",
    enterFrom: "bottom",
    rounded: "lg",
    border: true,
  },
});

// ============================================================================
// Dialog Content Variants
// ============================================================================

export const dialogContentVariants = cva("", {
  variants: {
    variant: {
      background: "surface-background",
      card: "surface-card",
      popover: "surface-popover",
    },

    spacing: {
      none: "",
      sm: "px-dialog-x-sm py-dialog-y-sm space-y-dialog-y-xs",
      md: "px-dialog-x-md py-dialog-y-md space-y-dialog-y-sm",
      lg: "px-dialog-x-lg py-dialog-y-lg space-y-dialog-y-md",
      "drawer-sm": "px-drawer-x-sm py-drawer-y-sm space-y-drawer-y-xs",
      "drawer-md": "px-drawer-x-md py-drawer-y-md space-y-drawer-y-sm",
      "drawer-lg": "px-drawer-x-lg py-drawer-y-lg space-y-drawer-y-md",
    },
  },

  defaultVariants: {
    spacing: "md",
    variant: "background",
  },
});
