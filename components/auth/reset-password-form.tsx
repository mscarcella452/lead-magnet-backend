"use client";

import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { AuthCard } from "./cards/auth-card";
import { PasswordCreationFields } from "@/components/ui/forms/password-creation-fields";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { resetPasswordAction } from "@/lib/server/auth/actions/write/resetPasswordAction";
import { validateResetPassword } from "@/lib/auth/auth-forms/validation";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "reset-password-form-error";

// ==============================================
// ResetPasswordForm
// ==============================================

export function ResetPasswordForm({ token }: { token: string }) {
  const {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
  } = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    const validationError = validateResetPassword({
      password,
      confirmPassword,
    });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    await submit(() => resetPasswordAction(token, formData));
  };

  return (
    <AuthCard description="Set New Password">
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="group"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <PasswordCreationFields
            fieldHasError={fieldHasError}
            clearFieldError={clearFieldError}
            formErrorId={FORM_ERROR_ID}
            isPassWordReset={true}
          />
        </FormMotionAlertContainer>

        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Resetting password…" : "Reset Password"}
        </Button>
      </Container>
    </AuthCard>
  );
}
