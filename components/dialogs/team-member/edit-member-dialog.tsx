"use client";

import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/feedback/dialog";
import { Container } from "@/components/ui/layout/containers";
import { Button } from "@/components/ui/controls/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { TeamMemberForm } from "@/components/dialogs/team-member/shared/team-member-form";
import { TeamMemberFormData, EditMemberDialogPayload } from "@/types/ui/dialog";
import { editTeamMemberAction } from "@/lib/server/actions/write/editTeamMemberAction";
import { UserRole } from "@prisma/client";
import { type TeamMemberFormRef } from "@/components/dialogs/team-member/shared/lib/types";
import { resendTeamMemberInviteAction } from "@/lib/server/actions/write/resendTeamMemberInviteAction";

// ============================================================
// Types
// ============================================================

const FORM_ID = "edit-member-form";
// ============================================================
// EditMemberDialog
// ============================================================

export const EditMemberDialog = ({
  userId,
  initialFormData,
  hasPendingInvite,
}: EditMemberDialogPayload) => {
  const [formData, setFormData] = useState<TeamMemberFormData>(initialFormData);
  const { closeDialog } = useDialogs();
  const formRef = useRef<TeamMemberFormRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.validate()) return;
    closeDialog();

    const result = await editTeamMemberAction(userId, {
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
    });

    const emailChanged = formData.email !== initialFormData.email;

    if (result.success) {
      if (emailChanged && hasPendingInvite) {
        const resend = await resendTeamMemberInviteAction(userId);
        toast.success(
          resend.success
            ? "Member updated and invite resent."
            : "Member updated but failed to resend invite.",
        );
      } else {
        toast.success("Member updated successfully.");
      }
    } else {
      toast.error(result.error);
      // toast.error("Failed to update member.");
    }
  };

  return (
    <DialogContent layout="responsiveModal">
      <Container spacing="content">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription className="truncate">
            Update the details for {formData.name ?? "this team member"}.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <TeamMemberForm
            ref={formRef}
            id={FORM_ID}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
          />
        </DialogBody>
        <DialogFooter>
          <Container
            spacing="group"
            position="end"
            width="fit"
            className="flex flex-row"
          >
            <Button type="button" intent="soft" size="sm" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} size="sm">
              Save Changes
            </Button>
          </Container>
        </DialogFooter>
      </Container>
    </DialogContent>
  );
};
