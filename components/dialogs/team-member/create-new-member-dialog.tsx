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
import { TeamMemberConfirm } from "@/components/dialogs/team-member/shared/team-member-confirm";
import { type TeamMemberFormRef } from "@/components/dialogs/team-member/shared/lib/types";
import { DEFAULT_FORM_DATA } from "@/components/dialogs/team-member/shared/lib/constants";
import { type TeamMemberFormData } from "@/types/ui/dialog";
import { toast } from "sonner";
import { inviteTeamMemberAction } from "@/lib/server/team/actions/write/inviteTeamMemberAction";
import { UserRole } from "@prisma/client";
import { motion, AnimatePresence } from "motion/react";

type Step = "form" | "confirm";

const FORM_ID = "invite-member-form";

export const CreateNewMemberDialog = () => {
  const [formData, setFormData] =
    useState<TeamMemberFormData>(DEFAULT_FORM_DATA);
  const [step, setStep] = useState<Step>("form");
  const { closeDialog } = useDialogs();
  const formRef = useRef<TeamMemberFormRef>(null);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.validate()) return;
    setStep("confirm");
  };

  const handleSubmit = async () => {
    closeDialog();
    const result = await inviteTeamMemberAction({
      name: formData.name,
      email: formData.email,
      role: formData.role as UserRole,
    });
    if (result.success) {
      toast.success("Invite sent successfully.");
    } else {
      toast.error(result.error ?? "Failed to invite team member.");
    }
  };

  return (
    <DialogContent layout="responsiveModal">
      <motion.div layout>
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Container spacing="content">
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    An email will be sent with instructions to set their
                    password and access the dashboard.
                  </DialogDescription>
                </DialogHeader>

                <DialogBody>
                  <TeamMemberForm
                    ref={formRef}
                    id={FORM_ID}
                    formData={formData}
                    onChange={setFormData}
                    onSubmit={handleReview}
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
                      Continue
                    </Button>
                  </Container>
                </DialogFooter>
              </Container>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <Container spacing="block">
                <DialogHeader>
                  <DialogTitle>Confirm Invite</DialogTitle>
                  <DialogDescription>
                    Please review the details before sending the invite.
                  </DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <TeamMemberConfirm formData={formData} />
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
                      onClick={() => setStep("form")}
                    >
                      Back
                    </Button>
                    <Button type="button" size="sm" onClick={handleSubmit}>
                      Send Invite
                    </Button>
                  </Container>
                </DialogFooter>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DialogContent>
  );
};
