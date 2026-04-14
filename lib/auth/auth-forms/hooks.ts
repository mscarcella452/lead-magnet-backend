import { useFormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "./types";

// ==============================================================================
// useAuthForm
// ==============================================================================

/**
 * Auth-specific form state hook.
 * Wraps the generic useFormState with AuthFieldKey type.
 */
export const useAuthForm = () => useFormState<AuthFieldKey>();
