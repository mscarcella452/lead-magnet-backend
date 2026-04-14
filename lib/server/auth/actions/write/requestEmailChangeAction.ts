"use server";
import { requestEmailChange } from "@/lib/server/auth/write/requestEmailChange";
import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { validateEmailChange } from "@/lib/auth/auth-forms/validation";

export async function requestEmailChangeAction(
  formData: FormData,
): Promise<FormState<AuthFieldKey>> {
  const email = (formData.get("email") as string)?.trim();
  const currentPassword = formData.get("currentPassword") as string;

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validateEmailChange({ email, currentPassword });
  if (validationError) return validationError;

  // ==============================================
  // Service
  // ==============================================

  try {
    await requestEmailChange({ email, currentPassword });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "unauthorized") {
        return { status: "error", error: "Unauthorized. Please log in again." };
      }
      if (e.message === "invalid_password") {
        return {
          status: "error",
          error: "Current password is incorrect.",
          field: "currentPassword",
        };
      }
      if (e.message === "email_taken") {
        return {
          status: "error",
          error: "Email is already in use.",
          field: "email",
        };
      }
      if (e.message === "email_send_failed") {
        return {
          status: "error",
          error: "Failed to send verification email. Please try again.",
        };
      }
    }
    return {
      status: "error",
      error: "Failed to request email change. Please try again.",
    };
  }

  return { status: "success" };
}
