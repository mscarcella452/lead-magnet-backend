"use server";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { resetPassword } from "@/lib/server/write/resetPassword";
import { validateResetPassword } from "@/components/auth/lib/utils";
import { type FormState } from "@/components/auth/lib/types";

export async function resetPasswordAction(
  token: string,
  formData: FormData,
): Promise<FormState> {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validateResetPassword({ password, confirmPassword });
  if (validationError) return validationError;

  // ==============================================
  // Service
  // ==============================================

  let username: string;

  try {
    const result = await resetPassword(token, password);
    username = result.username;
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "invalid_token") {
        return { status: "error", error: "Invalid reset link." };
      }
      if (e.message === "token_expired") {
        return {
          status: "error",
          error: "Your reset link has expired. Please request a new one.",
        };
      }
    }
    return {
      status: "error",
      error: "Failed to reset password. Please try again.",
    };
  }

  // ==============================================
  // Auto-login
  // ==============================================

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return {
      status: "error",
      error: "Password reset but login failed. Please sign in manually.",
    };
  }

  return { status: "success" }; // never reached — redirect fires above
}
