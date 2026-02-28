"use client";

import * as React from "react";

// ============================================================================
// State Types
// ============================================================================

export type DialogState = {
  shouldRender: boolean;
  animationPhase: "idle" | "entering" | "stable" | "exiting";
};

export type DialogAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "ENTRANCE_COMPLETE" }
  | { type: "EXIT_COMPLETE" };

// ============================================================================
// Reducer
// ============================================================================

export const dialogReducer = (
  state: DialogState,
  action: DialogAction,
): DialogState => {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        shouldRender: true,
        animationPhase: "entering",
      };

    case "CLOSE":
      return state.animationPhase !== "idle"
        ? { ...state, animationPhase: "exiting" }
        : state;

    case "ENTRANCE_COMPLETE":
      return state.animationPhase === "entering"
        ? { ...state, animationPhase: "stable" }
        : state;

    case "EXIT_COMPLETE":
      return {
        ...state,
        shouldRender: false,
        animationPhase: "idle",
      };

    default:
      return state;
  }
};

// ============================================================================
// Context
// ============================================================================

interface DialogContextValue {
  open?: boolean;
  handleClose?: () => void;
  onEntranceComplete?: () => void;
  onExitComplete?: () => void;
  animateChildren: boolean;
  isIdle: boolean;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within <Dialog>");
  }
  return context;
};

// ============================================================================
// Exports
// ============================================================================

export { DialogContext };
