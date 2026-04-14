"use server";
import { completeUserInvite } from "@/lib/server/auth/write/completeUserInvite";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { validateAccountCreation } from "@/lib/auth/auth-forms/validation";
import { APP_ROUTES } from "@/lib/server/constants";

export async function completeInviteAction(
  token: string,
  formData: FormData,
): Promise<FormState<AuthFieldKey>> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validateAccountCreation({
    username,
    password,
    confirmPassword,
  });
  if (validationError) return validationError;

  // ==============================================
  // Service
  // ==============================================

  try {
    await completeUserInvite(token, username, password);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "invalid_token") {
        return { status: "error", error: "Invalid invite link." };
      }
      if (e.message === "token_expired") {
        return {
          status: "error",
          error:
            "Your invite link has expired. Please ask your admin to resend your invite.",
        };
      }
      if (e.message === "username_taken") {
        return {
          status: "error",
          error: "That username is already taken.",
          field: "username",
        };
      }
    }
    return {
      status: "error",
      error: "Failed to set up your account. Please try again.",
    };
  }

  // ==============================================
  // Auto-login
  // ==============================================

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: APP_ROUTES.DASHBOARD,
    });
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return {
      status: "error",
      error: "Account created but login failed. Please sign in manually.",
    };
  }

  return { status: "success" };
}
