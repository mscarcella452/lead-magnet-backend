import { FieldClassRecord } from "@/design-system/types/helper-types";

// ============================================================================
// filterFieldClasses
// ============================================================================
/**
 * Filters a FieldClassRecord to include only specified fields and keys.
 *
 * Takes a nested field/key class map and returns a subset containing only
 * the fields and keys you specify. Useful for creating component-specific
 * variants from a larger set of design tokens.
 *
 * @template ClassMap - The input FieldClassRecord type
 * @template F - Array of field names to keep
 * @template K - Array of key names to keep
 *
 * @param params.fields - Array of field names to include (e.g., ["height", "text"])
 * @param params.keys - Array of key names to include (e.g., ["xs", "sm", "md"])
 * @param params.fieldClasses - The source FieldClassRecord to filter
 * @returns Filtered FieldClassRecord with only specified fields and keys
 *
 * @example
 * const allSizeClasses = {
 *   height: { xs: "h-8", sm: "h-9", md: "h-11", lg: "h-12", xl: "h-14" },
 *   text: { xs: "text-xs", sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" },
 *   padding: { xs: "px-2", sm: "px-3", md: "px-4", lg: "px-6", xl: "px-8" }
 * };
 *
 * const filtered = filterFieldClasses({
 *   fields: ["height", "text"],
 *   keys: ["xs", "sm", "md"],
 *   fieldClasses: allSizeClasses
 * });
 * // Result: {
 * //   height: { xs: "h-8", sm: "h-9", md: "h-11" },
 * //   text: { xs: "text-xs", sm: "text-sm", md: "text-base" }
 * // }
 */
export function filterFieldClasses<
  ClassMap extends FieldClassRecord<string, string>,
  F extends readonly (keyof ClassMap)[],
  K extends readonly (keyof ClassMap[keyof ClassMap])[],
>({
  fields,
  keys,
  fieldClasses,
}: {
  fields: F;
  keys: K;
  fieldClasses: ClassMap;
}): Partial<Record<F[number], Partial<Record<K[number], string>>>> {
  const filtered = Object.fromEntries(
    Object.entries(fieldClasses)
      .filter(([variant]) => fields.includes(variant as F[number]))
      .map(([variant, keyClasses]) => [
        variant,
        Object.fromEntries(
          Object.entries(keyClasses as Record<K[number], string>).filter(
            ([key]) => keys.includes(key as K[number]),
          ),
        ),
      ]),
  ) as Partial<Record<F[number], Partial<Record<K[number], string>>>>;
  return filtered;
}
