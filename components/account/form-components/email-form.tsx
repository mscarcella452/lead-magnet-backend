"use client";

import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { EmailInput } from "@/components/ui/forms/form-inputs";
import { validateEmailInput } from "@/lib/auth/auth-forms/validation";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { toast } from "sonner";
import { AccountFieldCard } from "../shared/account-field-card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/forms";
import type { CurrentUser } from "@/lib/auth/auth-server-actions";
import { ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { useAlertDialogs } from "@/components/dialogs/providers";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "email-form-error";

// ==============================================
// EmailForm
// ==============================================

export function EmailForm({ user }: { user: CurrentUser }) {
  const { errorMessage, fieldHasError, clearFieldError, setFormError } =
    useAuthForm();
  const { setActiveAlertDialog } = useAlertDialogs();

  // ---------------------------------------------
  // Error Check
  // ---------------------------------------------

  const emailError = fieldHasError("email");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = (formData.get("email") as string)?.trim();

    // Check if no changes
    if (email === user.email) {
      toast.info("This is already your current email address.");
      return;
    }
    const confirmEmail = (formData.get("confirmEmail") as string)?.trim();

    // Validation
    const validationError = validateEmailInput(email, confirmEmail);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setActiveAlertDialog(ALERT_DIALOG_TYPES.UPDATE_EMAIL, { newEmail: email });
  };

  return (
    <AccountFieldCard
      title="Change email"
      description="Enter a new email address. You'll need to confirm it before the change takes effect."
    >
      <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
        <FormMotionAlertContainer
          error={errorMessage}
          spacing="group"
          alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <EmailInput
                id="email"
                name="email"
                defaultValue={user.email}
                onChange={() => clearFieldError("email")}
                aria-describedby={emailError ? FORM_ERROR_ID : undefined}
                aria-invalid={emailError}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmEmail">Confirm Email</FieldLabel>
              <EmailInput
                id="confirmEmail"
                name="confirmEmail"
                placeholder="Confirm Email"
                onPaste={(e) => e.preventDefault()}
                onChange={() => clearFieldError("email")}
                aria-describedby={emailError ? FORM_ERROR_ID : undefined}
                aria-invalid={emailError}
                required
              />
            </Field>
          </FieldGroup>
        </FormMotionAlertContainer>
        <Button type="submit" size="sm">
          Verify Change
        </Button>
      </Container>
    </AccountFieldCard>
  );
}
