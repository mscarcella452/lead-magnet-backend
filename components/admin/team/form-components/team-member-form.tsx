"use client";

import { useState } from "react";
import { Container } from "@/components/ui/layout/containers";
import { FormMotionAlertContainer } from "@/components/ui/forms/form-alert-container";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/forms/field";
import { NameInput, EmailInput } from "@/components/ui/forms/form-inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls/select";
import { useTeamMemberForm } from "@/lib/team/team-forms/hooks";
import { validateTeamMember } from "@/lib/team/team-forms/validation";
import { getTeamMemberFormData } from "@/lib/team/team-forms/utils";
import type { TeamMemberFormData } from "@/lib/team/team-forms/types";
import { UserRole } from "@prisma/client";
import { ASSIGNABLE_ROLE_OPTIONS } from "@/config/field-controls-config";
import { SITE_CONFIG } from "@/config";

// ============================================================
// Types
// ============================================================

type FormStateProps = Omit<
  ReturnType<typeof useTeamMemberForm>,
  "isPending" | "submit" | "reset"
>;

interface TeamMemberFormProps extends FormStateProps {
  formId: string;
  initialData: TeamMemberFormData;
  onValid: (data: TeamMemberFormData) => void;
}

// ============================================================
// Constants
// ============================================================

export const PLACEHOLDER_NAME = "Jamie Smith";

export const PLACEHOLDER_EMAIL = `${PLACEHOLDER_NAME.toLowerCase().replace(/\s+/g, ".")}@${new URL(SITE_CONFIG.domain).hostname}`;

// ============================================================
// TeamMemberForm
// ============================================================

export const TeamMemberForm = ({
  formId,
  initialData,
  onValid,
  errorMessage,
  fieldHasError,
  clearFieldError,
  setFormError,
}: TeamMemberFormProps) => {
  const [role, setRole] = useState<UserRole | "">(initialData.role);

  const nameError = fieldHasError("name");
  const emailError = fieldHasError("email");
  const confirmEmailError = fieldHasError("confirmEmail");
  const roleError = fieldHasError("role");

  const onSelectChange = (value: string) => {
    setRole(value as UserRole);
    clearFieldError("role");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, confirmEmail } = getTeamMemberFormData(e);
    const validationError = validateTeamMember({
      name,
      email,
      confirmEmail,
      role,
    });
    if (validationError) {
      setFormError(validationError);
      return;
    }
    onValid({ name, email, confirmEmail, role: role as UserRole });
  };

  return (
    <Container
      as="form"
      id={formId}
      onSubmit={handleSubmit}
      spacing="block"
      noValidate
    >
      <FormMotionAlertContainer
        error={errorMessage}
        alertProps={{ id: formId, spacing: "block" }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <NameInput
              id="name"
              name="name"
              placeholder={PLACEHOLDER_NAME}
              defaultValue={initialData.name}
              onChange={() => clearFieldError("name")}
              aria-describedby={nameError ? formId : undefined}
              aria-invalid={nameError}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <EmailInput
              id="email"
              name="email"
              placeholder={PLACEHOLDER_EMAIL}
              defaultValue={initialData.email}
              onChange={() => clearFieldError("email")}
              aria-describedby={emailError ? formId : undefined}
              aria-invalid={emailError}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmEmail">Confirm Email</FieldLabel>
            <EmailInput
              id="confirmEmail"
              name="confirmEmail"
              placeholder={PLACEHOLDER_EMAIL}
              defaultValue={initialData.confirmEmail}
              onPaste={(e) => e.preventDefault()}
              onChange={() => clearFieldError("confirmEmail")}
              aria-describedby={confirmEmailError ? formId : undefined}
              aria-invalid={confirmEmailError}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select value={role} onValueChange={onSelectChange}>
              <SelectTrigger
                id="role"
                aria-describedby={roleError ? formId : undefined}
                aria-invalid={roleError}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNABLE_ROLE_OPTIONS.map((r: UserRole) => (
                  <SelectItem key={r} value={r}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="role" value={role} />
          </Field>
        </FieldGroup>
      </FormMotionAlertContainer>
    </Container>
  );
};
