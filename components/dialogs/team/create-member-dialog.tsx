"use client";

import { useDialogs } from "@/components/dialogs/providers/dialog-provider";
import { inviteTeamMemberAction } from "@/lib/server/team/actions/write/inviteTeamMemberAction";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { ERROR_CODES } from "@/lib/server/constants";

import { TeamMemberForm } from "@/components/admin/team/form-components/team-member-form";
import { TeamMemberConfirm } from "@/components/admin/team/form-components/team-member-confirm";
import {
  TeamMemberCard,
  TeamMemberCardFooter,
} from "@/components/admin/team/form-components/team-member-card";
import { toFormState } from "@/lib/team/team-forms/utils";
import { useTeamMemberForm } from "@/lib/team/team-forms/hooks";
import { useTeamMemberSteps } from "@/components/dialogs/team/useTeamMemberSteps";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/feedback/dialog";
import { motion, AnimatePresence } from "motion/react";

// ============================================================
// Constants
// ============================================================

const INVITE_FORM_ID = "invite-member-form";

const dialogInfo = {
  form: {
    title: "Invite Team Member",
    description:
      "An email will be sent with instructions to set their password and access the dashboard.",
  },
  confirm: {
    title: "Confirm Invite",
    description: "Please review the details before sending the invite.",
  },
};

// ============================================================
// CreateMemberDialog
// ============================================================

export const CreateMemberDialog = () => {
  const { isPending, submit, reset, ...formProps } = useTeamMemberForm();
  const { step, formData, handleValid, handleBack } = useTeamMemberSteps(
    undefined,
    { onBack: reset },
  );
  const { closeDialog } = useDialogs();

  const handleConfirm = async () => {
    await submit(async () => {
      const result = await inviteTeamMemberAction({
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
      });
      if (result.success) {
        closeDialog();
        toast.success("Invite sent successfully.");
      } else {
        toast.error(result.error ?? "Failed to send invite.");
        // Go back to form step if error is fixable by user
        if (
          result.code === ERROR_CODES.EMAIL_EXISTS ||
          result.code === ERROR_CODES.INVITE_EXISTS
        ) {
          handleBack();
        }
      }
      return toFormState(result);
    });
  };

  return (
    <DialogContent
      layout="responsiveModal"
      onInteractOutside={(e) => {
        if (step === "confirm") e.preventDefault();
      }}
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{dialogInfo[step].title}</DialogTitle>
        <DialogDescription>{dialogInfo[step].description}</DialogDescription>
      </DialogHeader>
      <motion.div layout>
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <TeamMemberCard
              key="form"
              direction="backward"
              {...dialogInfo.form}
              content={
                <TeamMemberForm
                  formId={INVITE_FORM_ID}
                  initialData={formData}
                  onValid={handleValid}
                  {...formProps}
                />
              }
              footer={
                <TeamMemberCardFooter
                  secondaryProps={{ label: "Cancel", onClick: closeDialog }}
                  primaryProps={{
                    label: "Continue",
                    type: "submit",
                    form: INVITE_FORM_ID,
                  }}
                />
              }
            />
          ) : (
            <TeamMemberCard
              key="confirm"
              direction="forward"
              spacing="block"
              {...dialogInfo.confirm}
              content={<TeamMemberConfirm formData={formData} />}
              footer={
                <TeamMemberCardFooter
                  secondaryProps={{ label: "Back", onClick: handleBack }}
                  primaryProps={{
                    label: "Send Invite",
                    type: "button",
                    disabled: isPending,
                    onClick: handleConfirm,
                  }}
                />
              }
            />
          )}
        </AnimatePresence>
      </motion.div>
    </DialogContent>
  );
};
