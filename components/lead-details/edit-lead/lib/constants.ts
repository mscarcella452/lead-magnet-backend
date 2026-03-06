import { LEAD_SOURCES, LEAD_CAMPAIGNS } from "@/types/lead-constants";
import type { LeadFieldKey } from "@/types/lead-fields";

// ====================================================
// Constants
// ====================================================

// ====================================================
// SELECT_FIELD_OPTIONS
// Options for select fields whose values come from typed
// constants rather than LeadFieldMeta.options in the registry.
//
// EditRow resolves input options in this priority order:
//   1. This map (for DB-backed fields with external option lists)
//   2. field.options from LEAD_FIELD_REGISTRY (for metadata fields)
//   3. Empty — field renders as plain text input as fallback
// ====================================================
export const SELECT_FIELD_OPTIONS: Partial<
  Record<LeadFieldKey, readonly string[]>
> = {
  lead_source: LEAD_SOURCES,
  campaign: LEAD_CAMPAIGNS,
};
