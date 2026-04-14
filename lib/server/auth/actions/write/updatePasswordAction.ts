"use server";
import { updatePassword } from "@/lib/server/auth/write/updatePassword";
import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { validatePasswordChange } from "@/lib/auth/auth-forms/validation";

export async function updatePasswordAction(
  formData: FormData,
): Promise<FormState<AuthFieldKey>> {
  const currentPassword = formData.get("currentPassword") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validatePasswordChange({
    currentPassword,
    password,
    confirmPassword,
  });
  if (validationError) return validationError;

  // ==============================================
  // Service
  // ==============================================

  try {
    await updatePassword({ currentPassword, newPassword: password });
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
      if (e.message === "password_same") {
        return {
          status: "error",
          error: "New password must be different from current password.",
          field: "password",
        };
      }
    }
    return {
      status: "error",
      error: "Failed to update password. Please try again.",
    };
  }

  return { status: "success" };
}
