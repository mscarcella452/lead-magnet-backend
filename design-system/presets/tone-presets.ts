import {
  ToneFieldClassRecord,
  ToneHoverFieldClassRecord,
} from "@/design-system/lib/types/preset-types";

export const BASE_TONE_FIELD_RECORD = {
  // ============================================================================
  // PRIMARY (w/out hover)
  // ============================================================================
  primary: {
    solid: "tone-primary-solid",
    soft: "tone-primary-soft-badge",
    outline: "tone-primary-outline-popover",
  },
  // ============================================================================
  // BRAND (w/out hover)
  // ============================================================================
  brand: {
    solid: "tone-brand-solid",
    soft: "tone-brand-soft",
    outline: "tone-brand-outline",
  },
  // ============================================================================
  // INFO (w/out hover)
  // ============================================================================
  info: {
    solid: "tone-info-solid",
    soft: "tone-info-soft",
    outline: "tone-info-outline",
  },
  // ============================================================================
  // SUCCESS (w/out hover)
  // ============================================================================
  success: {
    solid: "tone-success-solid",
    soft: "tone-success-soft",
    outline: "tone-success-outline",
  },
  // ============================================================================
  // WARNING (w/out hover)
  // ============================================================================
  warning: {
    solid: "tone-warning-solid",
    soft: "tone-warning-soft",
    outline: "tone-warning-outline",
  },
  // ============================================================================
  // DESTRUCTIVE (w/out hover)
  // ============================================================================
  destructive: {
    solid: "tone-destructive-solid",
    soft: "tone-destructive-soft",
    outline: "tone-destructive-outline",
  },
  // ============================================================================
  // PURPLE ((w/out hover))
  // ============================================================================
  purple: {
    solid: "tone-purple-solid",
    soft: "tone-purple-soft",
    outline: "tone-purple-outline",
  },
} satisfies ToneFieldClassRecord;

export const CONTROL_TONE_FIELD_RECORD = {
  // ============================================================================
  // PRIMARY (with hover)
  // ============================================================================
  primary: {
    solid: "tone-primary-solid tone-primary-solid-hover",
    soft: "tone-primary-soft tone-primary-soft-hover",
    outline: "tone-primary-outline tone-primary-outline-hover",
    ghost: "tone-primary-ghost tone-primary-ghost-hover",
    text: "tone-primary-text tone-primary-text-hover",
    "ghost-text": "tone-primary-ghost-text tone-primary-ghost-text-hover",
  },
  // ============================================================================
  // BRAND (with hover)
  // ============================================================================
  brand: {
    solid: "tone-brand-solid tone-brand-solid-hover",
    soft: "tone-brand-soft tone-brand-soft-hover",
    outline: "tone-brand-outline tone-brand-outline-hover",
    ghost: "tone-brand-ghost tone-brand-ghost-hover",
    text: "tone-brand-text tone-brand-text-hover",
    "ghost-text": "tone-brand-ghost-text tone-brand-ghost-text-hover",
  },
  // ============================================================================
  // INFO (with hover)
  // ============================================================================
  info: {
    solid: "tone-info-solid tone-info-solid-hover",
    soft: "tone-info-soft tone-info-soft-hover",
    outline: "tone-info-outline tone-info-outline-hover",
    ghost: "tone-info-ghost tone-info-ghost-hover",
    text: "tone-info-text tone-info-text-hover",
    "ghost-text": "tone-info-ghost-text tone-info-ghost-text-hover",
  },
  // ============================================================================
  // SUCCESS (with hover)
  // ============================================================================
  success: {
    solid: "tone-success-solid tone-success-solid-hover",
    soft: "tone-success-soft tone-success-soft-hover",
    outline: "tone-success-outline tone-success-outline-hover",
    ghost: "tone-success-ghost tone-success-ghost-hover",
    text: "tone-success-text tone-success-text-hover",
    "ghost-text": "tone-success-ghost-text tone-success-ghost-text-hover",
  },
  // ============================================================================
  // WARNING (with hover)
  // ============================================================================
  warning: {
    solid: "tone-warning-solid tone-warning-solid-hover",
    soft: "tone-warning-soft tone-warning-soft-hover",
    outline: "tone-warning-outline tone-warning-outline-hover",
    ghost: "tone-warning-ghost tone-warning-ghost-hover",
    text: "tone-warning-text tone-warning-text-hover",
    "ghost-text": "tone-warning-ghost-text tone-warning-ghost-text-hover",
  },
  // ============================================================================
  // DESTRUCTIVE (with hover)
  // ============================================================================
  destructive: {
    solid: "tone-destructive-solid tone-destructive-solid-hover",
    soft: "tone-destructive-soft tone-destructive-soft-hover",
    outline: "tone-destructive-outline tone-destructive-outline-hover",
    ghost: "tone-destructive-ghost tone-destructive-ghost-hover",
    text: "tone-destructive-text tone-destructive-text-hover",
    "ghost-text":
      "tone-destructive-ghost-text tone-destructive-ghost-text-hover",
  },
  // ============================================================================
  // PURPLE ((with hover))
  // ============================================================================
  purple: {
    solid: "tone-purple-solid tone-purple-solid-hover",
    soft: "tone-purple-soft tone-purple-soft-hover",
    outline: "tone-purple-outline tone-purple-outline-hover",
    ghost: "tone-purple-ghost tone-purple-ghost-hover",
    text: "tone-purple-text tone-purple-text-hover",
    "ghost-text": "tone-purple-ghost-text tone-purple-ghost-text-hover",
  },
} satisfies ToneHoverFieldClassRecord;
