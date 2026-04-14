"use client";

import { Button } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import {
  FieldDescription,
  FormMotionAlertContainer,
} from "@/components/ui/forms";

import { UsernameInput, NameInput } from "@/components/ui/forms/form-inputs";
import { updateProfileAction } from "@/lib/server/auth/actions/write/updateProfileAction";
import { validateProfile } from "@/lib/auth/auth-forms/validation";
import { useAuthForm } from "@/lib/auth/auth-forms/hooks";
import { toast } from "sonner";
import { Input } from "@/components/ui/forms/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/forms";
import { AccountFieldCard } from "../shared/account-field-card";
import type { CurrentUser } from "@/lib/server/auth/read/getCurrentUser";

// ==============================================
// Constants
// ==============================================

const FORM_ERROR_ID = "profile-form-error";

// ==============================================
// ProfileForm
// ==============================================

export function ProfileForm({ user }: { user: CurrentUser }) {
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

  const nameError = fieldHasError("name");
  const usernameError = fieldHasError("username");

  // ---------------------------------------------
  // Handle Submit
  // ---------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = (formData.get("name") as string)?.trim();
    const username = (formData.get("username") as string)?.trim();

    // Check if no changes
    if (name === user.name && username === user.username) {
      toast.info("No changes to save.");
      return;
    }

    // Validation
    const validationError = validateProfile({ name, username });
    if (validationError) {
      setFormError(validationError);
      return;
    }

    // action submit
    await submit(async () => {
      const result = await updateProfileAction(formData);
      if (result.status === "success") {
        toast.success("Profile updated successfully");
      }
      return result;
    });
  };

  return (
    <Container spacing="content">
      <AccountFieldCard
        title="Personal Info"
        description="Update your name and username as they appear across the dashboard."
      >
        <Container as="form" onSubmit={handleSubmit} spacing="block" noValidate>
          <FormMotionAlertContainer
            error={errorMessage}
            spacing="group"
            alertProps={{ id: FORM_ERROR_ID, spacing: "block" }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <NameInput
                  id="name"
                  name="name"
                  defaultValue={user.name}
                  onChange={() => clearFieldError("name")}
                  aria-describedby={nameError ? FORM_ERROR_ID : undefined}
                  aria-invalid={nameError}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <UsernameInput
                  id="username"
                  name="username"
                  defaultValue={user.username}
                  onChange={() => clearFieldError("username")}
                  aria-describedby={usernameError ? FORM_ERROR_ID : undefined}
                  aria-invalid={usernameError}
                />
              </Field>
            </FieldGroup>
          </FormMotionAlertContainer>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </Container>
      </AccountFieldCard>
      <AccountFieldCard
        title="Role"
        description="Your role is managed by your workspace admin and cannot be changed here."
      >
        <Field>
          <Input id="role" name="role" value={user?.role} disabled />
          <FieldDescription className="text-caption">
            Contact your admin to request a role change.
          </FieldDescription>
        </Field>
      </AccountFieldCard>
    </Container>
  );
}
