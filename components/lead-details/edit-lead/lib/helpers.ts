import type { LeadWithRelations } from "@/types";
import type { LeadMetadata, LeadFieldKey } from "@/types/lead-fields";
import type { GroupedLeadFields } from "@/lib/utils/lead-magnets";
import { resolveFieldValue } from "@/components/lead-details/lib/helpers";
import {
  DYNAMIC_SECTION_ORDER,
  SECTION_LABELS,
} from "@/components/lead-details/lib/constants";
import { SELECT_FIELD_OPTIONS } from "@/components/lead-details/edit-lead/lib/constants";
import type {
  EditRowProps,
  EditSection,
  EditFormState,
  EditFormDiff,
} from "@/components/lead-details/edit-lead/lib/types";
import { LeadPriority, LeadStatus } from "@prisma/client";
import { type UpdateLeadData } from "@/lib/server/write/updateLead";

// ====================================================
// buildEditSections
// ====================================================

/**
 * Transforms grouped lead magnet fields into the EditSection shape
 * consumed by EditLeadDetails. Mirrors buildDynamicSections but outputs
 * EditRowProps instead of InfoRowProps — input rendering concerns
 * (fieldType, options) instead of display concerns (actions, orientation).
 * Sections with no fields are omitted. Order follows DYNAMIC_SECTION_ORDER.
 */
export function buildEditSections(
  lead: LeadWithRelations,
  metadata: LeadMetadata,
  grouped: GroupedLeadFields,
): EditSection[] {
  return DYNAMIC_SECTION_ORDER.filter(
    (section) => grouped[section]?.length,
  ).map((section) => {
    const fields = grouped[section]!;
    const items: EditRowProps[] = fields.map((field) => ({
      fieldKey: field.key,
      label: field.label,
      fieldType: field.fieldType,
      value: resolveFieldValue(field.key, lead, metadata),
      options: SELECT_FIELD_OPTIONS[field.key] ?? field.options,
    }));
    return { section, label: SECTION_LABELS[section], items };
  });
}

// ====================================================
// resolveInitialValues
// ====================================================

/**
 * Seeds the edit form state from the current lead values.
 * Iterates every field in the grouped sections so the form
 * only tracks fields that are part of this lead's magnet definition.
 */
export function resolveInitialValues(
  lead: LeadWithRelations,
  metadata: LeadMetadata,
  grouped: GroupedLeadFields,
): EditFormState {
  return Object.values(grouped)
    .flat()
    .reduce<EditFormState>((acc, field) => {
      if (!field) return acc;
      acc[field.key] = resolveFieldValue(field.key, lead, metadata);
      return acc;
    }, {});
}

// ====================================================
// diffFormState
// ====================================================

/**
 * Returns only the fields that changed from their initial values.
 * Passed to the submit handler to avoid redundant updates.
 * A field is included if its current value differs from initial,
 * including changes to null (i.e. the user cleared the field).
 */
export function diffFormState(
  initial: EditFormState,
  current: EditFormState,
): EditFormDiff {
  return (Object.keys(current) as LeadFieldKey[]).reduce<EditFormDiff>(
    (acc, key) => {
      if (current[key] !== initial[key]) acc[key] = current[key];
      return acc;
    },
    {},
  );
}

// ====================================================
// diffToUpdateData
// ====================================================

/**
 * Converts EditFormDiff to UpdateLeadData, handling null-to-undefined conversion
 * for non-nullable Prisma fields (name, email).
 * Nullable fields (source, status, priority, metadata) can stay as null.
 */
export function diffToUpdateData(diff: EditFormDiff): UpdateLeadData {
  const { lead_source, email, name, status, priority, ...metadataFields } =
    diff;

  return {
    ...(name !== undefined && { name: name ?? undefined }),
    ...(email !== undefined && { email: email ?? undefined }),
    ...(lead_source !== undefined && { source: lead_source ?? undefined }),
    ...(status !== undefined && {
      status: (status as LeadStatus) ?? undefined,
    }),
    ...(priority !== undefined && {
      priority: (priority as LeadPriority) ?? undefined,
    }),
    ...(Object.keys(metadataFields).length > 0 && {
      metadata: metadataFields,
    }),
  };
}
