"use client";
import * as React from "react";

// ============================================================================
// State Types
// ============================================================================

export type AlertDialogState = {
  shouldRender: boolean;
  animationPhase: "idle" | "entering" | "stable" | "exiting";
};

export type AlertDialogContextAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "ENTRANCE_COMPLETE" }
  | { type: "EXIT_COMPLETE" };

// ============================================================================
// Reducer
// ============================================================================

export const alertDialogReducer = (
  state: AlertDialogState,
  action: AlertDialogContextAction,
): AlertDialogState => {
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

interface AlertDialogContextValue {
  open?: boolean;
  onEntranceComplete?: () => void;
  onExitComplete?: () => void;
  animateChildren: boolean;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null,
);

// ============================================================================
// Hook
// ============================================================================

export const useAlertDialogContext = () => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialogContext must be used within <AlertDialog>");
  }
  return context;
};

// ============================================================================
// Exports
// ============================================================================

export { AlertDialogContext };
