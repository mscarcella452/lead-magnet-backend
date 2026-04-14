"use client";

import { Button, Link } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { PasswordInput } from "@/components/ui/forms/form-inputs";
import { PasswordCreationFields } from "@/components/ui/forms/password-creation-fields";
import { updatePasswordAction } from "@/lib/server/auth/actions/write/updatePasswordAction";
import { validatePasswordChange } from "@/lib/auth/auth-forms/validation";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { toast } from "sonner";
import { AccountFieldCard } from "../shared/account-field-card";
import type { CurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { useState } from "react";
import { AUTH_ROUTES } from "@/lib/server/constants";

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
  const [resetKey, setResetKey] = useState(0);

  // ---------------------------------------------
  // Error Check
  // ---------------------------------------------

  const currentPasswordError = fieldHasError("currentPassword");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
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
        form.reset();
        setResetKey((prev) => prev + 1);
      }
      return result;
    });
  };

  return (
    <AccountFieldCard
      title="Change Password"
      description="Update your password by entering your current password and choosing a new one."
    >
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="block"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
            onChange={() => clearFieldError("currentPassword")}
            aria-describedby={currentPasswordError ? FORM_ERROR_ID : undefined}
            aria-invalid={currentPasswordError}
          />

          <PasswordCreationFields
            fieldHasError={fieldHasError}
            clearFieldError={clearFieldError}
            formErrorId={FORM_ERROR_ID}
            key={resetKey}
            isPassWordReset={true}
          />
        </FormMotionAlertContainer>
        <Container spacing="group">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating…" : "Update Password"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Forgot your password?{" "}
            <Link href={AUTH_ROUTES.ACCOUNT_RECOVERY} intent="text">
              Send a reset link
            </Link>
            .
          </p>
        </Container>
      </Container>
    </AccountFieldCard>
  );
}
