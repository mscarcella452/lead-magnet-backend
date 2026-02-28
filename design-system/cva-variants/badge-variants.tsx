import { cva } from "class-variance-authority";
import { BASE_TONE_FIELD_RECORD } from "@/design-system/presets/tone-presets";
import { CONTROL_RADIUS_FIELD_RECORD } from "@/design-system/presets/radius-presets";
import {
  filterFieldClasses,
  flattenFieldClasses,
} from "@/design-system/lib/helpers";
import {
  type ToneFields,
  type ToneKeys,
} from "@/design-system/lib/types/preset-types";

// ============================================================================
// Types
// ============================================================================
const BADGE_THEME_VARIANTS = [
  "primary",
  "brand",
  "info",
  "success",
  "warning",
  "destructive",
  "purple",
] satisfies readonly ToneFields[];

const BADGE_THEME_INTENTS = [
  "solid",
  "soft",
  "outline",
] satisfies readonly ToneKeys[];

type BadgeVariant = (typeof BADGE_THEME_VARIANTS)[number];
type BadgeIntent = (typeof BADGE_THEME_INTENTS)[number];

// ============================================================================
// Theme Classes
// ============================================================================
const filteredTheme = filterFieldClasses({
  fields: BADGE_THEME_VARIANTS,
  keys: BADGE_THEME_INTENTS,
  fieldClasses: BASE_TONE_FIELD_RECORD,
});

// ============================================================================
// Compound Variants
// ============================================================================
const compoundThemeVariants = flattenFieldClasses(filteredTheme, {
  fieldName: "variant",
  keyName: "intent",
});

// ============================================================================
// Badge CVA Variants
// ============================================================================
export const badgeVariants = cva(
  [
    "flex items-center justify-center gap-1",
    "border border-transparent",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[1em]",
    "leading-none w-fit font-display font-medium",
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
      } satisfies Record<BadgeVariant | "unstyled", string>,

      intent: {
        solid: "",
        soft: "",
        outline: "border bg-transparent",
      } satisfies Record<BadgeIntent, string>,

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
      },
    },
    compoundVariants: [...compoundThemeVariants],
    defaultVariants: {
      variant: "primary",
      intent: "soft",
      size: "md",
      radius: "pill",
      mode: "default",
    },
  },
);
