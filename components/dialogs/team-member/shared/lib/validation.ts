import { type TeamMemberFormData } from "@/components/dialogs/team-member/shared/lib/types";
import { type FormErrors } from "@/components/ui/controls/form";

// ============================================================
// Validation
// ============================================================

export function validateForm(formData: TeamMemberFormData): FormErrors {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!formData.role) {
    errors.role = "Please select a role.";
  }

  return errors;
}
