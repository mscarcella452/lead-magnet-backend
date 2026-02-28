import { FieldClassRecord } from "@/design-system/lib/types/helper-types";

// ============================================================================
// flattenFieldClasses
// ============================================================================
/**
 * Flattens a FieldClassRecord into an array of compound variant objects.
 *
 * Takes a nested field/key class map and flattens it into an array where each
 * entry represents one field+key combination. This format is ideal for CVA's
 * compoundVariants option, allowing you to define all variant combinations
 * programmatically rather than manually.
 *
 * @template F - Field names (outer keys)
 * @template K - Key names (inner keys)
 * @template ClassMap - The input FieldClassRecord type
 *
 * @param fieldClasses - The FieldClassRecord to flatten
 * @returns Array of objects with field, key, and class properties
 *
 * @example
 * const themeClasses = {
 *   primary: { solid: "bg-primary text-white", outline: "border-primary text-primary" },
 *   brand: { solid: "bg-brand text-white", outline: "border-brand text-brand" }
 * };
 *
 * const compoundVariants = flattenFieldClasses(themeClasses);
 * // Result: [
 * //   { field: "primary", key: "solid", class: "bg-primary text-white" },
 * //   { field: "primary", key: "outline", class: "border-primary text-primary" },
 * //   { field: "brand", key: "solid", class: "bg-brand text-white" },
 * //   { field: "brand", key: "outline", class: "border-brand text-brand" }
 * // ]
 *
 * // Use in CVA compoundVariants:
 * const buttonVariants = cva("base-classes", {
 *   variants: {
 *     variant: { primary: "", brand: "" },
 *     intent: { solid: "", outline: "" }
 *   },
 *   compoundVariants: compoundVariants
 * });
 */

export function flattenFieldClasses<
  F extends string,
  K extends string,
  FieldName extends string,
  KeyName extends string,
  ClassMap extends FieldClassRecord<F, K>,
>(
  fieldClasses: ClassMap,
  options?: {
    fieldName?: FieldName;
    keyName?: KeyName;
  },
): { [P in FieldName]: F } & { [P in KeyName]: K } & { class: string }[] {
  const fieldName = options?.fieldName ?? "field";
  const keyName = options?.keyName ?? "key";

  return Object.entries(fieldClasses).flatMap(([field, keys]) =>
    Object.entries(keys as Record<K, string>).map(([key, classes]) => ({
      [fieldName]: field,
      [keyName]: key,
      className: classes,
    })),
  ) as any;
}
