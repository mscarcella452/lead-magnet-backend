import type { FormState } from "@/lib/forms/useFormState";
import type { TeamMemberFieldKey, TeamMemberFormData } from "./types";
import type { ActionResult } from "@/types/server/actions";
import { ERROR_CODES } from "@/lib/server/constants";
import { UserRole } from "@prisma/client";

// ==============================================================================
// Form Data Extraction
// ==============================================================================

/**
 * Extracts and trims form data from a form submission event.
 * Used in team member form submit handlers to get typed form values.
 */
export const getTeamMemberFormData = (e: React.FormEvent) => {
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  return {
    name: (formData.get("name") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    confirmEmail: (formData.get("confirmEmail") as string)?.trim(),
    role: formData.get("role") as UserRole,
  };
};

// ==============================================================================
// Form Change Detection
// ==============================================================================

/**
 * Checks if team member form data has changed from initial values.
 * Used to prevent unnecessary updates when no changes were made.
 */
export const hasTeamMemberFormChanged = (
  formData: TeamMemberFormData,
  initialData: TeamMemberFormData,
): boolean =>
  formData.name !== initialData.name ||
  formData.email !== initialData.email ||
  formData.role !== initialData.role;

// ==============================================================================
// ActionResult Conversion
// ==============================================================================

/**
 * Converts an ActionResult from a server action to a FormState.
 * Maps email-related error codes (EMAIL_EXISTS, INVITE_EXISTS, INVALID_EMAIL)
 * to the email field so errors can be cleared when the user edits the field.
 */
export const toFormState = (
  result: ActionResult<unknown>,
): FormState<TeamMemberFieldKey> => {
  if (result.success) return { status: "idle" };

  // Map error codes to specific fields so they can be cleared on input change
  let field: TeamMemberFieldKey | undefined;
  if (
    result.code === ERROR_CODES.EMAIL_EXISTS ||
    result.code === ERROR_CODES.INVITE_EXISTS ||
    result.code === ERROR_CODES.INVALID_EMAIL
  ) {
    field = "email";
  }

  return {
    status: "error",
    error: result.error ?? "Something went wrong.",
    field,
  };
};
