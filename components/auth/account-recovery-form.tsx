"use client";

import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { AuthCard } from "./cards/auth-card";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { EmailInput } from "@/components/ui/forms/form-inputs";
import { validateEmail } from "@/lib/auth/auth-forms/validation";
import { requestPasswordResetAction } from "@/lib/server/auth/actions/write/requestPasswordResetAction";
import { SuccessResetCard } from "./cards/success-reset-card";
import { useState } from "react";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "account-recovery-form-error";

export function AccountRecoveryForm() {
  const {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
  } = useAuthForm();
  const [sentEmail, setSentEmail] = useState("");

  // ---------------------------------------------
  // Error Check
  // ---------------------------------------------

  const emailError = fieldHasError("email");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;

    // Validation
    const validationError = validateEmail(email);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    await submit(() => requestPasswordResetAction(formData));

    // submit only sets formState to error if result.status === "error"
    // so if we get here without an error, always show success card even if silent fail because email doesn't exist
    setSentEmail(email);
  };

  if (sentEmail)
    return (
      <SuccessResetCard sentEmail={sentEmail} setSentEmail={setSentEmail} />
    );

  return (
    <AuthCard description="We'll email your username and a password reset link.">
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="group"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <EmailInput
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={() => clearFieldError("email")}
            aria-describedby={emailError ? FORM_ERROR_ID : undefined}
            aria-invalid={emailError}
          />
        </FormMotionAlertContainer>

        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Sending…" : "Send Recovery Link"}
        </Button>
      </Container>
    </AuthCard>
  );
}
