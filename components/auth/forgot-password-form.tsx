"use client";

import { Button } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { AuthCard } from "./shared/auth-card";
import { FormMotionAlertContainer } from "@/components/ui/controls/form";
import { useAuthForm } from "@/components/auth/lib/useAuthForm";
import { EmailInput } from "./shared/auth-inputs";
import { validateEmail } from "./lib/utils";
import { requestPasswordResetAction } from "@/lib/server/actions/write/requestPasswordResetAction";
import { toast } from "sonner";
import { SuccessResetCard } from "./shared/success-reset-card";
import { useState } from "react";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "forgot-password-form-error";

export function ForgotPasswordForm() {
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
        <h1 className="sr-only">Password Magic Link Sent</h1>
        <SuccessResetCard sentEmail={sentEmail} setSentEmail={setSentEmail} />
      </Inset>
    );

  return (
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">Forgot Password</h1>

      <AuthCard description="Reset your password">
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
              required
            />
          </FormMotionAlertContainer>

          <Button type="submit" disabled={isPending} aria-busy={isPending}>
            {isPending ? "Sending…" : "Send Reset Link"}
          </Button>
        </Container>
      </AuthCard>
    </Inset>
  );
}
