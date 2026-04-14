import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/feedback/alert-dialog";

import { UpdateEmailAlertPayload } from "@/types/ui/dialog";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms";
import { PasswordInput } from "@/components/ui/forms/form-inputs";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/controls";
import { validateEmailChange } from "@/lib/auth/auth-forms/validation";
import { requestEmailChangeAction } from "@/lib/server/auth/actions/write/requestEmailChangeAction";
import { useAlertDialogs } from "@/components/dialogs/providers/alert-dialog-provider";

const FORM_ERROR_ID = "email-form-error";

export const AccountEmailChangeDialog = ({
  newEmail,
}: UpdateEmailAlertPayload) => {
  const {
    isPending,
    errorMessage,
    fieldHasError,
    clearFieldError,
    setFormError,
    submit,
  } = useAuthForm();
  const { closeAlertDialog } = useAlertDialogs();

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
    formData.set("email", newEmail);
    const email = (formData.get("email") as string)?.trim();
    const currentPassword = formData.get("currentPassword") as string;

    // // Validation
    const validationError = validateEmailChange({ email, currentPassword });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    // action submit
    await submit(async () => {
      const result = await requestEmailChangeAction(formData);

      if (result.status === "success") {
        toast.success("Verification email sent. Please check your inbox.");
        closeAlertDialog();
      }

      return result;
    });
  };

  return (
    <AlertDialogContent variant="background" spacing="md">
      <Container spacing="block">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm email change</AlertDialogTitle>
        </AlertDialogHeader>

        <Container
          as="form"
          spacing="group"
          id="email-change-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <AlertDialogDescription>
            Your email will be updated to{" "}
            <span className="font-semibold text-foreground">{newEmail}</span>.
            Enter your current password to authorize this change.
          </AlertDialogDescription>
          <FormMotionAlertContainer
            error={errorMessage}
            spacing="group"
            alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
          >
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
          </FormMotionAlertContainer>
        </Container>

        <AlertDialogFooter className=" justify-end gap-4">
          <AlertDialogCancel size="sm" intent="soft">
            Cancel
          </AlertDialogCancel>
          <Button
            type="submit"
            size="sm"
            form="email-change-form"
            variant="primary"
            disabled={isPending}
            aria-live="polite"
          >
            {isPending ? "Updating…" : "Update Email"}
          </Button>
        </AlertDialogFooter>
      </Container>
    </AlertDialogContent>
  );
};
