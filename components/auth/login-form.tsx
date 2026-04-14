"use client";

import { Button, Link } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import {
  UsernameInput,
  PasswordInput,
} from "@/components/ui/forms/form-inputs";
import { loginAction } from "@/lib/server/auth/actions/write/loginAction";
import { validateLogin } from "@/lib/auth/auth-forms/validation";
import { AuthCard } from "./cards/auth-card";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { AUTH_ROUTES } from "@/lib/server/constants";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "login-form-error";

// ==============================================
// LoginForm
// ==============================================

export function LoginForm({ defaultRedirect }: { defaultRedirect: string }) {
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
  const passwordError = fieldHasError("password");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = (formData.get("username") as string)?.trim();
    const password = formData.get("password") as string;

    // Validation
    const validationError = validateLogin({ username, password });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    // action submit
    await submit(() => loginAction(defaultRedirect, formData));
  };

  return (
    <AuthCard description="Sign in to your account">
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="group"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <Container spacing="item">
            <UsernameInput
              id="username"
              name="username"
              onChange={() => clearFieldError("username")}
              aria-describedby={usernameError ? FORM_ERROR_ID : undefined}
              aria-invalid={usernameError}
              autoFocus
            />
            <PasswordInput
              id="password"
              name="password"
              onChange={() => clearFieldError("password")}
              aria-describedby={passwordError ? FORM_ERROR_ID : undefined}
              aria-invalid={passwordError}
            />
          </Container>
          <Link
            variant="brand"
            intent="ghost-text"
            href={AUTH_ROUTES.ACCOUNT_RECOVERY}
            className="w-fit mx-auto"
          >
            Trouble Signing In?
          </Link>
        </FormMotionAlertContainer>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in…" : "Log In"}
        </Button>
      </Container>
    </AuthCard>
  );
}
