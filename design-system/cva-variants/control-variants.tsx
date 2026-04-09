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
const CONTROL_THEME_VARIANTS = [
  "primary",
  "brand",
  "info",
  "success",
  "warning",
  "destructive",
  "purple",
] satisfies readonly ToneHoverFields[];

const CONTROL_THEME_INTENTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "text",
  "ghost-text",
] satisfies readonly ToneHoverKeys[];

type ControlVariant = (typeof CONTROL_THEME_VARIANTS)[number];
type ControlIntent = (typeof CONTROL_THEME_INTENTS)[number];

// ============================================================================
// Theme Classes
// ============================================================================
const filteredTheme = filterFieldClasses({
  fields: CONTROL_THEME_VARIANTS,
  keys: CONTROL_THEME_INTENTS,
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
export const controlVariants = cva(
  [
    "cursor-pointer font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none",
    "transition-colors duration-500",
    "disabled:pointer-events-none disabled:opacity-70",
    "[&_svg]:shrink-0 [&_svg]:size-[1em]",
    // for default outline focus. its applied here because ghost-text and text intent is not included in the ring focus compound variants
    "focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2",
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
      } satisfies Record<ControlVariant | "unstyled", string>,
      intent: {
        solid: "",
        soft: "",
        outline: "border bg-transparent",
        ghost: "bg-transparent shadow-none",
        text: "h-fit p-0! hover:underline hover:underline-offset-4",
        "ghost-text": "h-fit p-0! ",
        // "ghost-text": "h-fit p-0 opacity-70 hover:opacity-100",
      } satisfies Record<ControlIntent, string>,

      size: {
        xs: "h-compact-h-lg px-compact-x-md control-text-sm",
        sm: "h-control-h-sm px-control-x-sm control-text-sm",
        md: "h-control-h-md px-control-x-md control-text-md",
        lg: "h-control-h-lg px-control-x-lg control-text-lg",
        "responsive-sm": [
          "@max-lg:h-compact-h-lg @max-lg:px-compact-x-md",
          "h-control-h-sm px-control-x-sm control-text-sm",
        ],
        "responsive-md": [
          "@max-lg:h-control-h-sm @max-lg:px-control-x-sm @max-lg:control-text-sm",
          "h-control-h-md px-control-x-md control-text-md",
        ],
        "responsive-lg": [
          "@max-lg:h-control-h-md @max-lg:px-control-x-md @max-lg:control-text-md",
          "h-control-h-lg px-control-x-lg control-text-lg",
        ],
        none: "",
      },

      radius: CONTROL_RADIUS_FIELD_RECORD,

      focus: {
        ring: "",
        default: "outline-ring ",
      },

      mode: {
        default: "",
        iconOnly: "aspect-square !p-0 rounded-full",
        responsiveIcon:
          "max-sm:aspect-square max-sm:!p-0 [&_.control-label]:max-sm:hidden max-sm:rounded-full [&_*]:max-sm:rounded-full",
        /**
         * `responsiveIcon` — shows icon-only on mobile, icon+label on desktop.
         * Requires a `<ControlLabel>` child wrapping the label text.
         */
      },
    },
    compoundVariants: [
      ...compoundThemeVariants,
      // text and ghost-text intent not included. its not incldued with ring because it covers up the icon/text
      {
        focus: "ring",
        intent: ["solid", "soft", "outline", "ghost"],
        className:
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset",
      },
    ],

    defaultVariants: {
      variant: "primary",
      intent: "solid",
      size: "md",
      radius: "rounded",
      mode: "default",
      focus: "ring",
    },
  },
);
