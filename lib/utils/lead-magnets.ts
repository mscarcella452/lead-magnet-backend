import {
  LEAD_FIELD_REGISTRY,
  LeadInfoSection,
  LeadFieldKey,
  LeadFieldType,
} from "@/types/lead-fields";
import {
  LEAD_MAGNETS,
  LeadMagnetType,
  LeadMagnetDefinition,
} from "@/types/lead-magnets";

// ===========================================================
// ResolvedLeadField
// A field entry enriched with its registry meta.
// ===========================================================
export type ResolvedLeadField = {
  key: LeadFieldKey;
  label: string;
  section: LeadInfoSection;
  order: number;
  fieldType: LeadFieldType;
  options?: readonly string[];
};

// ===========================================================
// GroupedLeadFields
// Fields grouped by section, sorted by order within each section.
// ===========================================================
export type GroupedLeadFields = Partial<
  Record<LeadInfoSection, ResolvedLeadField[]>
>;

// ===========================================================
// groupLeadFieldsBySection
// Low-level primitive. Takes an already-resolved definition
// and returns its fields grouped by section and sorted by order.
// ===========================================================
export function groupLeadFieldsBySection(
  definition: Pick<LeadMagnetDefinition, "fields">,
): GroupedLeadFields {
  return definition.fields.reduce<GroupedLeadFields>((acc, key) => {
    const meta = LEAD_FIELD_REGISTRY[key];
    if (!meta) return acc;
    const section = meta.section;
    if (!acc[section]) acc[section] = [];
    acc[section]!.push({ key, ...meta });
    acc[section]!.sort((a, b) => a.order - b.order);
    return acc;
  }, {});
}

// ===========================================================
// ALL_FIELDS
// Fallback field list when no lead magnet is defined.
// Extracted as a constant to avoid recomputing Object.keys
// on every call.
// ===========================================================
const ALL_FIELDS = Object.keys(LEAD_FIELD_REGISTRY) as LeadFieldKey[];

// ===========================================================
// groupFieldsBySection
// Convenience wrapper. Resolves a magnet type to its definition
// (falling back to ALL_FIELDS) then delegates to
// groupLeadFieldsBySection.
// ===========================================================
export function groupFieldsBySection(
  magnetType: LeadMagnetType | undefined,
): GroupedLeadFields {
  const definition = magnetType
    ? (LEAD_MAGNETS[magnetType] ?? { fields: ALL_FIELDS })
    : { fields: ALL_FIELDS };
  return groupLeadFieldsBySection(definition);
}
