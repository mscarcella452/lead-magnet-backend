import React from "react";
import { MotionProps } from "motion/react";

import {
  DIALOG_TYPES,
  ALERT_DIALOG_TYPES,
  DialogType,
  AlertDialogType,
  DialogPayloads,
  AlertDialogPayloads,
  DialogEnterFrom,
} from "@/types/ui/dialog";
import { EditLeadDialog } from "@/components/dialogs/leads/edit-lead-dialog";
import { ViewLeadDialog } from "@/components/dialogs/leads/view-lead-dialog";
import { DeleteLeadDialog } from "@/components/dialogs/leads/delete-lead-dialog";
import { CreateMemberDialog } from "@/components/dialogs/team/create-member-dialog";
import { DeleteMemberDialog } from "@/components/dialogs/team/delete-member";
import { AccountEmailChangeDialog } from "@/components/dialogs/account/account-email-change-dialog";

// ============================================================================
// Animation Map
// Maps entry directions to their Framer Motion transition props.
// ============================================================================

export const DIALOG_ANIMATION_MAP: Record<DialogEnterFrom, MotionProps> = {
  bottom: {
    initial: { y: 500, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 500, opacity: 0 },
  },
  top: {
    initial: { y: -500, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -500, opacity: 0 },
  },
  left: {
    initial: { x: -500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -500, opacity: 0 },
  },
  right: {
    initial: { x: 500, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 500, opacity: 0 },
  },
};

// ============================================================================
// Content Maps
// Maps each dialog type to its React component.
// ============================================================================

export const DIALOG_CONTENT_MAP: {
  [K in DialogType]: React.ComponentType<DialogPayloads[K]>;
} = {
  [DIALOG_TYPES.EDIT_LEAD]: EditLeadDialog,
  [DIALOG_TYPES.VIEW_LEAD]: ViewLeadDialog,
  [DIALOG_TYPES.CREATE_MEMBER]: CreateMemberDialog,
};

export const ALERT_DIALOG_CONTENT_MAP: {
  [K in AlertDialogType]: React.ComponentType<AlertDialogPayloads[K]>;
} = {
  [ALERT_DIALOG_TYPES.DELETE_LEAD]: DeleteLeadDialog,
  [ALERT_DIALOG_TYPES.DELETE_MEMBER]: DeleteMemberDialog,
  [ALERT_DIALOG_TYPES.UPDATE_EMAIL]: AccountEmailChangeDialog,
};
