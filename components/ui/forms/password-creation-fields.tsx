"use client";
import { useState } from "react";
import { Container, ContainerProps } from "@/components/ui/layout/containers";
import { Card } from "@/components/ui/layout/card";
import { PasswordInput } from "./form-inputs";
import { cn } from "@/lib/utils";
import { PASSWORD_MINIMUM_LENGTH } from "@/lib/auth/auth-forms/constants";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/forms";

// ==============================================
// Types
// ==============================================

interface PasswordCreationFieldsProps extends Omit<ContainerProps, "children"> {
  fieldHasError: (field: AuthFieldKey) => boolean;
  clearFieldError: (field: AuthFieldKey) => void;
  formErrorId: string;
  showLabels?: boolean;
  isPassWordReset?: boolean;
}

interface passwordFields {
  password: string;
  confirmPassword: string;
}

// ==============================================
// Component
// ==============================================

export function PasswordCreationFields({
  fieldHasError,
  clearFieldError,
  formErrorId,
  showLabels = false,
  isPassWordReset = false,
  ...props
}: PasswordCreationFieldsProps) {
  const [fields, setFields] = useState<passwordFields>({
    password: "",
    confirmPassword: "",
  });

  // ---------------------------------------------
  // Error Check
  // ---------------------------------------------

  const passwordError = fieldHasError("password");
  const confirmPasswordError = fieldHasError("confirmPassword");

  // ---------------------------------------------
  // Handle Input Change
  // ---------------------------------------------
  const handleChange = (
    field: "password" | "confirmPassword",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  return (
    <Container spacing="group" {...props}>
      <FieldGroup spacing="item">
        <Field>
          {showLabels && (
            <FieldLabel htmlFor="newPassword">
              {isPassWordReset ? "New Password" : "Password"}
            </FieldLabel>
          )}
          <PasswordInput
            id="newPassword"
            name="password"
            placeholder={isPassWordReset ? "New Password" : "Password"}
            value={fields.password}
            onChange={(e) => handleChange("password", e)}
            aria-describedby={passwordError ? formErrorId : undefined}
            aria-invalid={passwordError}
          />
        </Field>
        <Field>
          {showLabels && (
            <FieldLabel htmlFor="confirmNewPassword">
              Confirm Password
            </FieldLabel>
          )}
          <PasswordInput
            id="confirmNewPassword"
            name="confirmPassword"
            placeholder={
              isPassWordReset ? "Confirm New Password" : "Confirm Password"
            }
            value={fields.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e)}
            onPaste={(e) => e.preventDefault()}
            aria-describedby={confirmPasswordError ? formErrorId : undefined}
            aria-invalid={confirmPasswordError}
          />
        </Field>
      </FieldGroup>
      <PasswordRequirements fields={fields} isPassWordReset={isPassWordReset} />
    </Container>
  );
}

// ==============================================
// PasswordRequirements
// ==============================================

export function PasswordRequirements({
  fields,
  isPassWordReset,
}: {
  fields: passwordFields;
  isPassWordReset?: boolean;
}) {
  const { password, confirmPassword } = fields;
  return (
    <Card size="sm" variant="card-blur" border>
      <Container spacing="item" className="text-xs">
        <p className="font-medium text-muted-foreground">
          {isPassWordReset ? "New Password must be:" : "Password must be:"}
        </p>
        <ul className="list-disc list-inside space-y-1 text-subtle-foreground">
          <li
            className={cn({
              "text-success-text": password.length >= PASSWORD_MINIMUM_LENGTH,
            })}
          >
            At least {PASSWORD_MINIMUM_LENGTH} characters
          </li>
          <li
            className={cn({
              "text-success-text": password && password === confirmPassword,
            })}
          >
            Fields must match
          </li>
        </ul>
      </Container>
    </Card>
  );
}
