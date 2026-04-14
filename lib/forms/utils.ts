import { FormState } from "./useFormState";

export const fieldError = <TFieldKey extends string>(
  error: string,
  field: TFieldKey | TFieldKey[],
): FormState<TFieldKey> => ({ status: "error", error, field });

export const requireField = <TFieldKey extends string>(
  value: string,
  message: string,
  field: TFieldKey,
): FormState<TFieldKey> | null => (value ? null : fieldError(message, field));
