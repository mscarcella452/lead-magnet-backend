import { UserRole } from "@prisma/client";
// ============================================================================
// types
// ============================================================================

export interface TeamMemberFormData {
  name: string;
  email: string;
  role: UserRole | "";
}

// ============================================================================
// Constants
// Unique identifiers for all dialogs — used to open dialogs and map to
// their components.
// ============================================================================

/** Dialog type identifiers. */
export const DIALOG_TYPES = {
  // Lead table
  EDIT_LEAD: "editLead",
  VIEW_LEAD: "viewLead",
  // Team table
  CREATE_NEW_MEMBER: "createNewMember",
  EDIT_MEMBER: "editMember",
} as const;

/** Alert dialog type identifiers. */
export const ALERT_DIALOG_TYPES = {
  // Lead table
  DELETE_LEAD: "deleteLead",
  // Team table
  DELETE_MEMBER: "deleteMember",
} as const;

// ============================================================================
// Primitive Types
// ============================================================================

/** Dialog type identifiers. */
export type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];

/** Alert dialog type identifiers. */
export type AlertDialogType =
  (typeof ALERT_DIALOG_TYPES)[keyof typeof ALERT_DIALOG_TYPES];

/** Animation entry direction for dialog transitions. */
export type DialogEnterFrom = "left" | "right" | "top" | "bottom";

// ============================================================================
// Payload Maps
// Defines the data each dialog requires when opened.
// ============================================================================

export type LeadUpdatePayload = {
  leadId: string;
  onConfirm: () => void | Promise<void>;
};

/** Dialog payload types. */
export type DialogPayloads = {
  [DIALOG_TYPES.EDIT_LEAD]: LeadUpdatePayload;
  [DIALOG_TYPES.VIEW_LEAD]: LeadUpdatePayload;
  [DIALOG_TYPES.CREATE_NEW_MEMBER]: never;
  [DIALOG_TYPES.EDIT_MEMBER]: {
    userId: string;
    initialFormData: TeamMemberFormData;
    hasPendingInvite: boolean;
  };
};

/** Alert dialog payload types. */
export type AlertDialogPayloads = {
  [ALERT_DIALOG_TYPES.DELETE_LEAD]: {
    leadIds: string[];
    onConfirm?: () => void | Promise<void>;
  };
  [ALERT_DIALOG_TYPES.DELETE_MEMBER]: {
    userId: string;
  };
};

// ============================================================================
// Active Dialog Types
// Discriminated unions combining a dialog type with its payload.
// Enables type-safe payload access based on which dialog is open.
// ============================================================================

/** Active dialog type. */
export type ActiveDialog = {
  [K in DialogType]: {
    dialogType: K;
    payload: DialogPayloads[K];
  };
}[DialogType];

/** Active alert dialog type. */
export type ActiveAlertDialog = {
  [K in AlertDialogType]: {
    dialogType: K;
    payload: AlertDialogPayloads[K];
  };
}[AlertDialogType];

// ============================================================================
// Dialog Payload Aliases
// Convenience types for each dialog's payload — use these in component props
// instead of the verbose DialogPayloads[typeof DIALOG_TYPES.X] syntax.
// ============================================================================

// Dialogs
export type EditLeadDialogPayload =
  DialogPayloads[typeof DIALOG_TYPES.EDIT_LEAD];
export type ViewLeadDialogPayload =
  DialogPayloads[typeof DIALOG_TYPES.VIEW_LEAD];
// export type CreateNewMemberDialogPayload =
//   DialogPayloads[typeof DIALOG_TYPES.CREATE_NEW_MEMBER];
export type EditMemberDialogPayload =
  DialogPayloads[typeof DIALOG_TYPES.EDIT_MEMBER];

// Alert Dialogs
export type DeleteLeadAlertPayload =
  AlertDialogPayloads[typeof ALERT_DIALOG_TYPES.DELETE_LEAD];
export type DeleteMemberAlertPayload =
  AlertDialogPayloads[typeof ALERT_DIALOG_TYPES.DELETE_MEMBER];
