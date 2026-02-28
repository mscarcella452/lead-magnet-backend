import { FieldClassRecord } from "@/design-system/lib/types/helper-types";

// ============================================================================
// mergeNestedFields
// ============================================================================
/**
 * Merges multiple FieldClassRecord objects by combining their class strings.
 *
 * Takes multiple nested field/key class maps and merges them together,
 * concatenating class strings for matching field+key combinations with space separation.
 * Useful for combining base styles with hover states, focus states, or other modifiers.
 *
 * @template F - Field names (outer keys like "primary", "brand", "height", "text")
 * @template K - Key names (inner keys like "solid", "outline", "xs", "md")
 *
 * @param records - Multiple FieldClassRecord objects to merge
 * @returns A single FieldClassRecord with all class strings combined
 *
 * @example
 * const baseClasses = {
 *   primary: { solid: "bg-primary text-white", outline: "border-primary" },
 *   secondary: { solid: "bg-secondary", outline: "border-secondary" }
 * };
 *
 * const hoverClasses = {
 *   primary: { solid: "hover:bg-primary-dark", outline: "hover:bg-primary-soft" },
 *   secondary: { solid: "hover:bg-secondary-dark", outline: "hover:bg-secondary-soft" }
 * };
 *
 * const merged = mergeNestedFields(baseClasses, hoverClasses);
 * // Result: {
 * //   primary: {
 * //     solid: "bg-primary text-white hover:bg-primary-dark",
 * //     outline: "border-primary hover:bg-primary-soft"
 * //   },
 * //   secondary: {
 * //     solid: "bg-secondary hover:bg-secondary-dark",
 * //     outline: "border-secondary hover:bg-secondary-soft"
 * //   }
 * // }
 */
export function mergeNestedFields<F extends string, K extends string>(
  ...records: readonly FieldClassRecord<F, K>[]
): FieldClassRecord<F, K> {
  const result = {} as FieldClassRecord<F, K>;

  for (const record of records) {
    for (const outerKey of Object.keys(record) as F[]) {
      // Initialize outer key if missing
      if (!result[outerKey]) {
        result[outerKey] = {} as Record<K, string>;
      }

      const inner = record[outerKey];

      for (const innerKey of Object.keys(inner) as K[]) {
        const current = result[outerKey][innerKey] || "";
        result[outerKey][innerKey] = [current, inner[innerKey]]
          .filter(Boolean)
          .join(" ");
      }
    }
  }

  return result;
}
