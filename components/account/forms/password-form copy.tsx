"use client";

import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { PasswordInput } from "@/components/auth/inputs/auth-inputs";
import { PasswordCreationFields } from "@/components/auth/inputs/password-creation-fields";
import { updatePasswordAction } from "@/lib/server/auth/actions/write/updatePasswordAction";
import { validatePasswordChange } from "@/components/auth/lib/utils";
import { useAuthForm } from "@/components/auth/lib/useAuthForm";
import { toast } from "sonner";
import { AccountFieldCard } from "../shared/account-field-card";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "password-form-error";

// ==============================================
// PasswordForm
// ==============================================

export function PasswordForm({ user }: { user: CurrentUser }) {
  const {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
  } = useAuthForm();

  // ---------------------------------------------
  // Error Check
  // ---------------------------------------------

  const currentPasswordError = fieldHasError("currentPassword");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const currentPassword = formData.get("currentPassword") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    const validationError = validatePasswordChange({
      currentPassword,
      password,
      confirmPassword,
    });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    // action submit
    await submit(async () => {
      const result = await updatePasswordAction(formData);
      if (result.status === "success") {
        toast.success("Password updated successfully");
        // Reset form
        (e.currentTarget as HTMLFormElement).reset();
      }
      return result;
    });
  };

  return (
    <AccountFieldCard title="Password" description="Manage your password">
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="group"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <Container spacing="item">
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder="Current Password"
              onChange={() => clearFieldError("currentPassword")}
              aria-describedby={
                currentPasswordError ? FORM_ERROR_ID : undefined
              }
              aria-invalid={currentPasswordError}
              required
            />
          </Container>
          <PasswordCreationFields
            fieldHasError={fieldHasError}
            clearFieldError={clearFieldError}
            formErrorId={FORM_ERROR_ID}
          />
        </FormMotionAlertContainer>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating…" : "Update Password"}
        </Button>
      </Container>
    </AccountFieldCard>
  );
}
