import { FieldClassRecord } from "@/design-system/lib/types/helper-types";

// ============================================================================
// mapVariants
// ============================================================================
/**
 * Transposes a FieldClassRecord from field→key→class to key→combinedClass.
 *
 * Takes a nested structure organized by fields (like height, text, padding)
 * and transposes it so each key (like xs, sm, md) contains all field classes
 * combined into a single space-separated string. Perfect for creating variant
 * definitions where you want all related styles grouped by size/state.
 *
 * @template T - The input FieldClassRecord type
 *
 * @param map - The FieldClassRecord to transpose
 * @returns Object mapping each key to its combined class string
 *
 * @example
 * const sizeFieldClasses = {
 *   height: { xs: "h-8", sm: "h-9", md: "h-11" },
 *   text: { xs: "text-xs", sm: "text-sm", md: "text-base" },
 *   padding: { xs: "px-2", sm: "px-3", md: "px-4" }
 * };
 *
 * const sizeVariants = mapVariants(sizeFieldClasses);
 * // Result: {
 * //   xs: "h-8 text-xs px-2",
 * //   sm: "h-9 text-sm px-3",
 * //   md: "h-11 text-base px-4"
 * // }
 *
 * // Use directly in cva:
 * const buttonVariants = cva("base-classes", {
 *   variants: {
 *     size: sizeVariants
 *   }
 * });
 */
export function mapVariants<T extends FieldClassRecord<string, string>>(
  map: T,
): Record<keyof T[keyof T], string> {
  const fields = Object.values(map) as Record<string, string>[];
  const keys = Object.keys(fields[0]) as Array<keyof T[keyof T]>;
  const result = {} as Record<keyof T[keyof T], string>;

  for (const key of keys) {
    result[key] = fields
      .map((field) => field[key as string])
      .filter(Boolean)
      .join(" ");
  }

  return result;
}
