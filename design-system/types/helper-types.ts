export type FieldClassRecord<F extends string, K extends string> = Record<
  F,
  Record<K, string>
>;
