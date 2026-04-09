"use client";

import { Button } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { AuthCard } from "./cards/auth-card";
import { PasswordCreationFields } from "./inputs";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { useAuthForm } from "@/components/auth/lib/useAuthForm";
import { resetPasswordAction } from "@/lib/server/auth/actions/write/resetPasswordAction";
import { validateResetPassword } from "./lib/utils";

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
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">Reset Password</h1>

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
    </Inset>
  );
}
