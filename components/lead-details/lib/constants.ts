import { LeadInfoSection, LeadFieldKey } from "@/types/leads/fields";
import { LeadWithRelations } from "@/types";

// ====================================================
// Constants
// ====================================================

/**
 * Ordered list of sections rendered below the Summary block.
 * Controls both visibility and display order in the lead detail view.
 */
export const DYNAMIC_SECTION_ORDER: LeadInfoSection[] = [
  "CONTACT",
  "BUSINESS",
  "PREFERENCES",
  "SOURCE",
];

/**
 * Human-readable heading for each lead info section.
 * Exhaustive over LeadInfoSection to catch missing entries at compile time.
 */
export const SECTION_LABELS: Record<LeadInfoSection, string> = {
  SUMMARY: "Lead Summary",
  CONTACT: "Contact",
  BUSINESS: "Business",
  PREFERENCES: "Preferences",
  SOURCE: "Source",
};

/**
 * Resolvers for lead fields that are stored as top-level DB columns
 * rather than inside the metadata JSON blob.
 *
 * Keys are LeadFieldKey values. Only fields that require special handling
 * (type coercion, column aliasing, nullability) need an entry here —
 * all other fields are read directly from metadata in resolveFieldValue.
 */
export const DB_FIELD_RESOLVERS: Partial<
  Record<LeadFieldKey, (lead: LeadWithRelations) => string | null>
> = {
  name: (lead) => lead.name ?? lead.displayId ?? null,
  email: (lead) => lead.email ?? null,
  status: (lead) => lead.status ?? null,
  priority: (lead) => lead.priority ?? null,
  lead_source: (lead) => lead.source ?? null, // DB column is `source`, field key is `lead_source`
  campaign: (lead) => lead.campaign ?? null,
};
