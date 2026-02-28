import { cva } from "class-variance-authority";
import { SURFACE_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";

// ============================================================================
// Accordion Variants
// ============================================================================

export const accordionVariants = cva("bg-(--accordion-bg)", {
  variants: {
    border: {
      true: "border",
      false: "",
    },
    variant: {
      background: "surface-background",
      card: "surface-card",
      popover: "surface-popover",
      outline: "border surface-outline",
      dividers: "border-y surface-outline",
    },
    // hover: {
    //   true: "data-[data-closed]:hover:bg-(--accordion-hover)",
    //   false: "",
    // },
    size: {
      sm: "px-accordion-x-sm py-accordion-y-sm",
      md: "px-accordion-x-md py-accordion-y-md",
      lg: "px-accordion-x-lg py-accordion-y-lg",
    },
    rounded: SURFACE_RADIUS_FIELD_RECORD,
  },

  defaultVariants: {
    size: "md",
    variant: "card",
    border: true,
    rounded: "lg",
  },
});
