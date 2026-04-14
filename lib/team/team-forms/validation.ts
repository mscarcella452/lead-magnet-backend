import type { FormState } from "@/lib/forms/useFormState";
import type { TeamMemberFieldKey, TeamMemberFormData } from "./types";
import { TEAM_MEMBER_ERROR_MESSAGES as ERR } from "./constants";
import { isValidEmail } from "@/lib/utils/validation";
import { fieldError, requireField } from "@/lib/forms/utils";

// ==============================================================================
// Form Validation
// ==============================================================================

/**
 * Validates team member form data.
 * Returns null if valid, or a FormState error with the specific field that failed.
 * Supports multi-field errors (e.g., email mismatch highlights both email fields).
 */
export const validateTeamMember = ({
  name,
  email,
  confirmEmail,
  role,
}: TeamMemberFormData): FormState<TeamMemberFieldKey> | null =>
  requireField(name, ERR.name, "name") ??
  requireField(email, ERR.email, "email") ??
  (email && !isValidEmail(email)
    ? fieldError(ERR.emailInvalid, "email")
    : null) ??
  (email.toLowerCase() !== confirmEmail.toLowerCase()
    ? fieldError(ERR.emailMatch, ["email", "confirmEmail"])
    : null) ??
  requireField(role, ERR.role, "role");
