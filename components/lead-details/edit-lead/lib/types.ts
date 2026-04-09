import type { LeadFieldKey, LeadFieldType } from "@/types/leads/fields";
import { BaseSection } from "@/components/lead-details/lib/types";

// ====================================================
// EditRowProps
// The shape of each field row rendered in the edit form.
// Mirrors InfoRowProps but replaces display concerns with
// input rendering concerns.
// ====================================================
export interface EditRowProps {
  fieldKey: LeadFieldKey;
  label: string;
  fieldType: LeadFieldType;
  value: string | null;
  options?: readonly string[];
}

// ====================================================
// EditSection
// A section of edit rows, typed using the shared BaseSection
// generic to stay consistent with the info view's DynamicSection.
// ====================================================
export type EditSection = BaseSection<EditRowProps>;

// ====================================================
// EditFormState
// Flat map of every field key to its current form value.
// Null means the field is present but empty; undefined means
// it wasn't part of this lead's magnet definition.
// ====================================================
export type EditFormState = Partial<Record<LeadFieldKey, string | null>>;

// ====================================================
// EditFormDiff
// Only the fields that changed from their initial values.
// Passed to the submit handler to avoid unnecessary updates.
// ====================================================
export type EditFormDiff = Partial<Record<LeadFieldKey, string | null>>;
