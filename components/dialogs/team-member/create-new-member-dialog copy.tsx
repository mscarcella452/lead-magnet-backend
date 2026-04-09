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
import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { TeamMemberForm } from "@/components/dialogs/team-member/shared/team-member-form";
import { type TeamMemberFormRef } from "@/components/dialogs/team-member/shared/lib/types";
import { DEFAULT_FORM_DATA } from "@/components/dialogs/team-member/shared/lib/constants";
import { type TeamMemberFormData } from "@/types/ui/dialog";
import { toast } from "sonner";
import { inviteTeamMemberAction } from "@/lib/server/team/actions/write/inviteTeamMemberAction";
import { UserRole } from "@prisma/client";
import { motion } from "motion/react";

const FORM_ID = "invite-member-form";

export const CreateNewMemberDialog = () => {
  const [formData, setFormData] =
    useState<TeamMemberFormData>(DEFAULT_FORM_DATA);

  const { closeDialog } = useDialogs();

  const formRef = useRef<TeamMemberFormRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.validate()) return;
    closeDialog();
    const result = await inviteTeamMemberAction({
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
    });
    if (result.success) {
      toast.success("Invite sent successfully.");
    } else {
      toast.error("Failed to invite team member.");
    }
  };

  return (
    <DialogContent layout="responsiveModal">
      <motion.div layout>
        <Container spacing="content">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              An email will be sent with instructions to set their password and
              access the dashboard.
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
              <Button
                type="button"
                intent="soft"
                size="sm"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button type="submit" form={FORM_ID} size="sm">
                Send Invite
              </Button>
            </Container>
          </DialogFooter>
        </Container>
      </motion.div>
    </DialogContent>
  );
};
