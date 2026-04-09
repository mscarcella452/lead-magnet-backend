import { FieldClassRecord } from "@/design-system/types/helper-types";

// ============================================================================
// TONE
// ============================================================================

export type ToneFields =
  | "primary"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "purple";
export type ToneKeys = "solid" | "soft" | "outline";

export type ToneFieldClassRecord = FieldClassRecord<ToneFields, ToneKeys>;

// ============================================================================
// TONE WITH HOVER
// ============================================================================

export type ToneHoverFields =
  | "primary"
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "purple";
export type ToneHoverKeys =
  | "solid"
  | "soft"
  | "outline"
  | "ghost"
  | "text"
  | "ghost-text";

export type ToneHoverFieldClassRecord = FieldClassRecord<
  ToneHoverFields,
  ToneHoverKeys
>;

// ============================================================================
// SIZE
// ============================================================================

export type SizeFields = "height" | "text" | "padding";
export type SizeKeys = "xs" | "sm" | "md" | "lg" | "xl";

export type SizeFieldClassRecord = FieldClassRecord<SizeFields, SizeKeys>;

// ============================================================================
// RADIUS Fields
// ============================================================================

export type ControlRadiusFields = "square" | "rounded" | "pill";
export type SurfaceRadiusFields =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";
