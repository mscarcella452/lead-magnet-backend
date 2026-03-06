import { LeadWithRelations } from "@/types";
import { formatDate } from "@/lib/utils/dates";
import { type LeadInfoSection, type LeadMetadata } from "@/types/lead-fields";
import { groupLeadFieldsBySection } from "@/lib/utils/lead-magnets";
import {
  CONTACT_ACTION_CONFIGS,
  EXCLUDED_SECTION_FIELDS,
} from "@/components/lead-details/view-lead/info/lib/constants";
import {
  type ContactAction,
  type InfoRowProps,
  type SummaryRowProps,
  type DynamicSection,
} from "@/components/lead-details/view-lead/info/lib/types";
import {
  DYNAMIC_SECTION_ORDER,
  SECTION_LABELS,
} from "@/components/lead-details/lib/constants";
import { resolveFieldValue } from "@/components/lead-details/lib/helpers";
import { type LeadContactMeta } from "@/components/lead-details/lib/types";

// ====================================================
// buildContactActionsByKey
// ====================================================

/**
 * Builds and indexes contact actions by their required LeadContactMeta field
 * (e.g. "phone" → [Call, Video Call]) in a single pass.
 * Actions are omitted entirely when their required field is absent from meta.
 *
 * Merges the former buildContactActions + groupContactActionsByKey helpers,
 * since neither was useful independently. The requiresMap is derived from
 * CONTACT_ACTION_CONFIGS so new actions flow through automatically.
 */
export function buildContactActionsByKey(
  meta: LeadContactMeta,
): Record<string, ContactAction[]> {
  const requiresMap = Object.fromEntries(
    CONTACT_ACTION_CONFIGS.map((c) => [c.key, c.requires]),
  );
  return CONTACT_ACTION_CONFIGS.reduce<Record<string, ContactAction[]>>(
    (acc, config) => {
      const rawValue = meta[config.requires];
      if (!rawValue) return acc;
      const action: ContactAction = {
        key: config.key,
        icon: config.icon,
        label: config.label,
        href: config.buildHref(rawValue),
      };
      (acc[requiresMap[config.key]] ??= []).push(action);
      return acc;
    },
    {},
  );
}

// ====================================================
// buildSummaryItems
// ====================================================

/**
 * Builds the fixed set of summary badge rows shown at the top of the lead detail view.
 * Score is always included; SummaryRow suppresses it if the value is null,
 * keeping this list flat and avoiding conditional spreads.
 */
export function buildSummaryItems(lead: LeadWithRelations): SummaryRowProps[] {
  return [
    { label: "Priority", value: lead.priority, variant: "destructive" },
    {
      label: "Last Updated",
      value: formatDate(lead.updatedAt),
      variant: "primary",
    },
    {
      label: "Score",
      value: lead.score != null ? String(lead.score) : null,
      variant: "success",
    },
  ];
}

// ====================================================
// buildDynamicSections
// ====================================================

/**
 * Transforms grouped lead magnet fields into the DynamicSection shape consumed by LeadInfo.
 * Sections with no fields in the magnet definition are omitted.
 * Display order follows DYNAMIC_SECTION_ORDER, not the grouping's insertion order.
 */
export function buildDynamicSections(
  lead: LeadWithRelations,
  metadata: LeadMetadata,
  contactActionsByKey: Record<string, ContactAction[]>,
  grouped: Partial<
    Record<
      LeadInfoSection,
      ReturnType<typeof groupLeadFieldsBySection>[LeadInfoSection]
    >
  >,
): DynamicSection[] {
  return DYNAMIC_SECTION_ORDER.filter(
    (section) => grouped[section]?.length,
  ).map((section) => {
    const fields = grouped[section]!;
    const items: InfoRowProps[] = fields
      .filter((field) => !EXCLUDED_SECTION_FIELDS.has(field.key))
      .map((field) => ({
        label: field.label,
        value: resolveFieldValue(field.key, lead, metadata),
        actions:
          contactActionsByKey[field.key as keyof typeof contactActionsByKey],
      }));
    return { section, label: SECTION_LABELS[section], items };
  });
}
