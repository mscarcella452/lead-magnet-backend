import { useState } from "react";

// ============================================================
// Types
// ============================================================

export type FormState<TFieldKey extends string> =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success" }
  | { status: "error"; error: string; field?: TFieldKey | TFieldKey[] };

// ============================================================
// useFormState
// ============================================================
/**
 * Manages form state, error clearing, and pending state
 * for  forms that call server actions directly.
 */

export function useFormState<TFieldKey extends string>() {
  const [formState, setFormState] = useState<FormState<TFieldKey>>({
    status: "idle",
  });

  const isPending = formState.status === "pending";

  const errorMessage =
    formState.status === "error" ? formState.error : undefined;

  const fieldHasError = (field?: TFieldKey): boolean => {
    // Returns true if the given field has an error.
    if (formState.status !== "error") return false;
    // If no field is provided, returns true if any error exists.
    if (!field) return true;
    // Supports both single field and array of fields.
    if (Array.isArray(formState.field)) return formState.field.includes(field);
    return formState.field === field;
  };

  const clearFieldError = (field: TFieldKey) => {
    // Clears the error state when the user edits a field that has an error.
    // Supports both single field and array of fields (e.g. email mismatch
    // errors that apply to both email and confirmEmail).
    if (formState.status !== "error") return;
    const { field: errorField } = formState;
    const shouldClear = Array.isArray(errorField)
      ? errorField.includes(field)
      : errorField === field;
    if (shouldClear) reset();
  };

  const setFormError = (error: FormState<TFieldKey>) => setFormState(error);

  const submit = async (action: () => Promise<FormState<TFieldKey>>) => {
    setFormState({ status: "pending" });
    const result = await action();
    setFormState(result.status === "error" ? result : { status: "idle" });
  };

  const reset = () => setFormState({ status: "idle" });

  return {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
    reset,
  };
}
