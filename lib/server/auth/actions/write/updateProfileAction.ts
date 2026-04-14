"use server";
import { updateProfile } from "@/lib/server/auth/write/updateProfile";
import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { validateProfile } from "@/lib/auth/auth-forms/validation";
import { revalidatePath } from "next/cache";
import { APP_ROUTES } from "@/lib/server/constants";

export async function updateProfileAction(
  formData: FormData,
): Promise<FormState<AuthFieldKey>> {
  const name = (formData.get("name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim();

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validateProfile({ name, username });
  if (validationError) return validationError;

  // ==============================================
  // Service
  // ==============================================

  try {
    await updateProfile({ name, username });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "unauthorized") {
        return { status: "error", error: "Unauthorized. Please log in again." };
      }
      if (e.message === "username_taken") {
        return {
          status: "error",
          error: "Username is already taken.",
          field: "username",
        };
      }
    }
    return {
      status: "error",
      error: "Failed to update profile. Please try again.",
    };
  }

  revalidatePath(APP_ROUTES.ACCOUNT);
  revalidatePath(APP_ROUTES.ADMIN_TEAM);

  return { status: "success" };
}
