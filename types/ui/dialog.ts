import { Lead } from "@prisma/client";

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
} as const;

/** Alert dialog type identifiers. */
export const ALERT_DIALOG_TYPES = {
  // Lead table
  DELETE_LEAD: "deleteLead",
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

/** Dialog payload types. */
export type DialogPayloads = {
  [DIALOG_TYPES.EDIT_LEAD]: { leadId: string };
  [DIALOG_TYPES.VIEW_LEAD]: { leadId: string };
};

/** Alert dialog payload types. */
export type AlertDialogPayloads = {
  [ALERT_DIALOG_TYPES.DELETE_LEAD]: {
    leadId: string[];
    onConfirm?: () => void;
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
