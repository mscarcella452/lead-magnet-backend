import { type TeamMemberFormData } from "@/types/ui/dialog";
import { type FormErrors } from "@/components/ui/controls/form";
import { isValidEmail } from "@/lib/utils/validation";

// ============================================================
// Validation
// ============================================================

export function validateForm(
  formData: TeamMemberFormData,
  confirmEmail: string,
): FormErrors {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(formData.email.trim())) {
    errors.email = "Please enter a valid email address.";
  } else if (!confirmEmail.trim()) {
    errors.confirmEmail = "Please confirm the email address.";
  } else if (formData.email !== confirmEmail) {
    errors.confirmEmail = "Email addresses do not match.";
  }

  if (!formData.role) {
    errors.role = "Please select a role.";
  }

  return errors;
}
