"use client";
import { Button } from "@/components/ui/controls";
import { Container, Inset } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { UsernameInput } from "./inputs";
import { AuthCard } from "./cards/auth-card";
import { completeInviteAction } from "@/lib/server/auth/actions/write/completeInviteAction";
import { validateAccountCreation } from "./lib/utils";
import { useAuthForm } from "./lib/useAuthForm";
import { PasswordCreationFields } from "./inputs/password-creation-fields";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "complete-account-error";

// ==============================================
// CompleteAccountForm
// ==============================================

export function CompleteAccountForm({ token }: { token: string }) {
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

  const usernameError = fieldHasError("username");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = (formData.get("username") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    const validationError = validateAccountCreation({
      username,
      password,
      confirmPassword,
    });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    await submit(() => completeInviteAction(token, formData));
  };

  return (
    <Inset className="flex min-h-screen @container">
      <h1 className="sr-only">Set Up Your Account</h1>

      <AuthCard
        description="Set up your account to get started"
        className="min-h-[550px]"
      >
        <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
          <FormMotionAlertContainer
            error={errorMessage}
            spacing="group"
            alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
          >
            <UsernameInput
              id="username"
              name="username"
              placeholder="Create Username"
              onChange={() => clearFieldError("username")}
              aria-describedby={usernameError ? FORM_ERROR_ID : undefined}
              aria-invalid={usernameError}
              autoFocus
            />

            <PasswordCreationFields
              fieldHasError={fieldHasError}
              clearFieldError={clearFieldError}
              formErrorId={FORM_ERROR_ID}
            />
          </FormMotionAlertContainer>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Setting up account…" : "Set Up Account"}
          </Button>
        </Container>
      </AuthCard>
    </Inset>
  );
}
