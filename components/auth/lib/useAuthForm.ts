// lib/hooks/use-form-state.ts

import { useState } from "react";
import type { FormState, FieldKey } from "@/components/auth/lib/types";

// ==============================================
// Hook
// ==============================================

/**
 * Manages form state, error clearing, and pending state
 * for auth forms that call server actions directly.
 */
export function useAuthForm() {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  // ==============================================
  // Derived State
  // ==============================================

  const isPending = formState.status === "pending";

  const errorMessage =
    formState.status === "error" ? formState.error : undefined;

  const fieldHasError = (field?: FieldKey) => {
    if (formState.status !== "error") return false;
    if (field) return formState.field === field;
    return true;
  };

  // ==============================================
  // Handlers
  // ==============================================

  const clearFieldError = (field: FieldKey) => {
    if (fieldHasError(field)) setFormState({ status: "idle" });
  };

  const setFormError = (error: FormState) => setFormState(error);

  const submit = async (action: () => Promise<FormState>) => {
    setFormState({ status: "pending" });
    const result = await action();
    if (result.status === "error") {
      setFormError(result);
      return;
    }
    setFormState({ status: "idle" });
  };

  return {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
  };
}
