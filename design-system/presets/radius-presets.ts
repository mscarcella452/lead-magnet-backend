import {
  ControlRadiusFields,
  SurfaceRadiusFields,
} from "@/design-system/lib/types/preset-types";

export const CONTROL_RADIUS_FIELD_RECORD: Record<ControlRadiusFields, string> =
  {
    square: "",
    rounded: "rounded-lg",
    pill: "rounded-full",
  };

export const SURFACE_RADIUS_FIELD_RECORD: Record<SurfaceRadiusFields, string> =
  {
    none: "",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
