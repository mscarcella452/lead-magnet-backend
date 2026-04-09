import { LeadWithRelations } from "@/types";
import { type LeadMetadata, type LeadFieldKey } from "@/types/leads/fields";
import { DB_FIELD_RESOLVERS } from "@/components/lead-details/lib/constants";
import { type InfoRowProps } from "@/components/lead-details/view-lead/info/lib/types";

// ====================================================
// resolveFieldValue
// ====================================================

/**
 * Returns a lead field's display value, preferring a DB_FIELD_RESOLVERS
 * entry for top-level model columns and falling back to the metadata JSON
 * blob for all other fields.
 */
export function resolveFieldValue(
  key: LeadFieldKey,
  lead: LeadWithRelations,
  metadata: LeadMetadata,
): string | null {
  const resolver = DB_FIELD_RESOLVERS[key];
  return resolver ? resolver(lead) : (metadata[key] ?? null);
}

// ====================================================
// hasAnyValue
// ====================================================

/**
 * Returns true if at least one item has a non-null value.
 * Used to suppress empty sections before they are rendered.
 */
export function hasAnyValue(items: InfoRowProps[]): boolean {
  return items.some((item) => item.value !== null);
}
