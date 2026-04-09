"use client";

import { Button, Link } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { AuthCard } from "./cards/auth-card";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { useAuthForm } from "@/components/auth/lib/useAuthForm";
import { EmailInput } from "./inputs/auth-inputs";
import { validateEmail } from "./lib/utils";
import { requestPasswordResetAction } from "@/lib/server/auth/actions/write/requestPasswordResetAction";
import { toast } from "sonner";
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
      <Inset className="flex min-h-screen @container">
        <h1 className="sr-only">Recovery Email Sent</h1>
        <SuccessResetCard sentEmail={sentEmail} setSentEmail={setSentEmail} />
      </Inset>
    );

  return (
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">Account Recovery</h1>

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
    </Inset>
  );
}
