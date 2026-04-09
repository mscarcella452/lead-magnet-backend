import { cva } from "class-variance-authority";
import { CONTROL_TONE_FIELD_RECORD } from "@/design-system/presets/tone-presets";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";
import {
  filterFieldClasses,
  flattenFieldClasses,
} from "@/design-system/lib/helpers";
import {
  type ToneHoverFields,
  type ToneHoverKeys,
} from "@/design-system/types/preset-types";

// ============================================================================
// Types
// ============================================================================
const CHIP_THEME_VARIANTS = [
  "primary",
  "brand",
  "info",
  "success",
  "warning",
  "destructive",
  "purple",
] satisfies readonly ToneHoverFields[];

const CHIP_THEME_INTENTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "text",
] satisfies readonly ToneHoverKeys[];

type ChipVariant = (typeof CHIP_THEME_VARIANTS)[number];
type ChipIntent = (typeof CHIP_THEME_INTENTS)[number];

// ============================================================================
// Theme Classes
// ============================================================================

const filteredTheme = filterFieldClasses({
  fields: CHIP_THEME_VARIANTS,
  keys: CHIP_THEME_INTENTS,
  fieldClasses: CONTROL_TONE_FIELD_RECORD,
});

// ============================================================================
// Compound Variants
// ============================================================================
const compoundThemeVariants = flattenFieldClasses(filteredTheme, {
  fieldName: "variant",
  keyName: "intent",
});

// ============================================================================
// Control Variants
// ============================================================================
export const chipVariants = cva(
  [
    "cursor-pointer font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none",
    "transition-colors duration-500",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
    "disabled:pointer-events-none disabled:opacity-70",
    "[&_svg]:shrink-0 [&_svg]:size-[1em]",
  ],
  {
    variants: {
      variant: {
        primary: "",
        brand: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
        purple: "",
        unstyled: "",
      } satisfies Record<ChipVariant | "unstyled", string>,
      intent: {
        solid: "",
        soft: "",
        outline: "border bg-transparent",
        ghost: "bg-transparent shadow-none",
        text: "h-fit p-0 rounded-none hover:underline",
      } satisfies Record<ChipIntent, string>,

      size: {
        sm: "h-compact-h-sm px-compact-x-sm compact-text-sm",
        md: "h-compact-h-md px-compact-x-md compact-text-md",
        lg: "h-compact-h-lg px-compact-x-lg compact-text-lg",
        none: "",
      },

      radius: CONTROL_RADIUS_FIELD_RECORD,
      mode: {
        default: "",
        iconOnly: "aspect-square !p-0",
        responsiveIcon:
          "max-sm:aspect-square max-sm:!p-0 [&_.control-label]:max-sm:hidden",
      },
    },
    compoundVariants: [...compoundThemeVariants],
    defaultVariants: {
      variant: "primary",
      intent: "solid",
      size: "md",
      radius: "rounded",
      mode: "default",
    },
  },
);
