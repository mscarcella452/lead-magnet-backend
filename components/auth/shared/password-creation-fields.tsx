"use client";
import { useState } from "react";
import { Container } from "@/components/ui/layout/containers";
import { Card } from "@/components/ui/layout/card";
import { PasswordInput } from "./auth-inputs";
import { cn } from "@/lib/utils";
import { PASSWORD_MINIMUM_LENGTH } from "@/components/auth/lib/constants";
import { type FieldKey } from "@/components/auth/lib/types";

// ==============================================
// Types
// ==============================================

interface PasswordCreationFieldsProps {
  fieldHasError: (field: FieldKey) => boolean;
  clearFieldError: (field: FieldKey) => void;
  formErrorId: string;
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
    <>
      <Container spacing="item">
        <PasswordInput
          id="password"
          name="password"
          value={fields.password}
          onChange={(e) => handleChange("password", e)}
          aria-describedby={passwordError ? formErrorId : undefined}
          aria-invalid={passwordError}
          required
        />
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={fields.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e)}
          onPaste={(e) => e.preventDefault()}
          aria-describedby={confirmPasswordError ? formErrorId : undefined}
          aria-invalid={confirmPasswordError}
          required
        />
      </Container>
      <PasswordRequirements {...fields} />
    </>
  );
}

// ==============================================
// PasswordRequirements
// ==============================================

export function PasswordRequirements(fields: passwordFields) {
  const { password, confirmPassword } = fields;
  return (
    <Card size="sm" variant="card-blur" border>
      <Container spacing="item" className="text-xs">
        <p className="font-medium text-muted-foreground">Password must be:</p>
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
