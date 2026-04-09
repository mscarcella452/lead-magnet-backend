"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/controls/select";
import { Container } from "@/components/ui/layout/containers";
import {
  FormMotionAlertContainer,
  type FormErrors,
} from "@/components/ui/forms";
import {
  type TeamMemberFormProps,
  type TeamMemberFormRef,
  ROLES,
} from "@/components/dialogs/team-member/shared/lib/types";
import { TeamMemberFormData } from "@/types/ui/dialog";
import { validateForm } from "@/components/dialogs/team-member/shared/lib/validation";
import {
  DEFAULT_EMAIL,
  DEFAULT_NAME,
} from "@/components/dialogs/team-member/shared/lib/constants";
import { UserRole } from "@prisma/client";

// ============================================================
// TeamMemberForm
// ============================================================

export const TeamMemberForm = forwardRef<
  TeamMemberFormRef,
  TeamMemberFormProps
>(function TeamMemberForm({ id, formData, onChange, onSubmit }, ref) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmEmail, setConfirmEmail] = useState(formData.email);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors = validateForm(formData, confirmEmail);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
  }));

  const handleChange = (data: TeamMemberFormData, field: keyof FormErrors) => {
    onChange(data);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleConfirmEmailChange = (value: string) => {
    setConfirmEmail(value);
    setErrors((prev) => ({ ...prev, confirmEmail: undefined }));
  };

  const isOwner = formData.role === "OWNER";

  const allowedRoles = isOwner
    ? ROLES
    : ROLES.filter((role) => role !== "OWNER");

  return (
    <Container
      as="form"
      spacing="group"
      id={id}
      onSubmit={onSubmit}
      aria-describedby="invite-form-error"
      noValidate
    >
      <FormMotionAlertContainer
        error={errors}
        spacing="group"
        alertProps={{
          id: "invite-form-error",
          // title: "Please fix the following:",
          spacing: "block",
        }}
      >
        <Container spacing="item">
          <label
            htmlFor={`${id}-name`}
            className="text-xs font-medium text-subtle-foreground"
          >
            Name
          </label>
          <Input
            id={`${id}-name`}
            placeholder={`e.g. ${DEFAULT_NAME}`}
            value={formData.name}
            onChange={(e) =>
              handleChange({ ...formData, name: e.target.value }, "name")
            }
            maxLength={50}
            required
          />
        </Container>
        <Container spacing="item">
          <label
            htmlFor={`${id}-email`}
            className="text-xs font-medium text-subtle-foreground"
          >
            Email
          </label>
          <Input
            id={`${id}-email`}
            type="email"
            placeholder={DEFAULT_EMAIL}
            value={formData.email}
            onChange={(e) =>
              handleChange({ ...formData, email: e.target.value }, "email")
            }
            maxLength={254}
            required
          />
        </Container>
        {/* Confirm Email */}
        <Container spacing="item">
          <label
            htmlFor={`${id}-confirm-email`}
            className="text-xs font-medium text-subtle-foreground"
          >
            Confirm Email
          </label>
          <Input
            id={`${id}-confirm-email`}
            type="email"
            placeholder="Re-enter email address"
            value={confirmEmail}
            onChange={(e) => handleConfirmEmailChange(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            maxLength={254}
            required
          />
        </Container>

        <Container spacing="item">
          <label
            htmlFor={`${id}-role`}
            className="text-xs font-medium text-subtle-foreground"
          >
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              handleChange({ ...formData, role: value as UserRole }, "role")
            }
          >
            <SelectTrigger id={`${id}-role`} disabled={isOwner}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Container>
      </FormMotionAlertContainer>
    </Container>
  );
});
