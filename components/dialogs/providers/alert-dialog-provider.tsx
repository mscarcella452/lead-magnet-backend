"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import React from "react";
import { usePathname } from "next/navigation";

import {
  AlertDialog,
  AlertDialogPortal,
} from "@/components/ui/feedback/alert-dialog";
import {
  AlertDialogType,
  AlertDialogPayloads,
  ActiveAlertDialog,
} from "@/types/ui/dialog";
import { ALERT_DIALOG_CONTENT_MAP } from "@/config/dialog-config";

// ============================================================================
// Context Types
// ============================================================================

export type SetActiveAlertDialog = <T extends AlertDialogType>(
  dialogType: T,
  payload: AlertDialogPayloads[T] extends undefined
    ? never
    : AlertDialogPayloads[T],
) => void;

interface AlertDialogsContextType {
  setActiveAlertDialog: SetActiveAlertDialog;
  closeAlertDialog: () => void;
}

// ============================================================================
// Context & Hook
// ============================================================================

const AlertDialogsContext = createContext<AlertDialogsContextType | null>(null);

export const useAlertDialogs = () => {
  const context = useContext(AlertDialogsContext);
  if (!context) {
    throw new Error("useAlertDialogs must be used within AlertDialogProvider");
  }
  return context;
};

// ============================================================================
// AlertDialogProvider — Manages alert dialog state and rendering
// ============================================================================

export const AlertDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeAlertDialog, setActiveAlertDialog] =
    useState<ActiveAlertDialog | null>(null);
  const pathname = usePathname();

  // Close alert dialog on route change
  useEffect(() => {
    setActiveAlertDialog(null);
  }, [pathname]);

  const setActiveAlertDialogTyped = useCallback<SetActiveAlertDialog>(
    (dialogType, payload) => {
      // Type assertion to help TypeScript understand the discriminated union
      setActiveAlertDialog({ dialogType, payload } as ActiveAlertDialog);
    },
    [],
  );

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) setActiveAlertDialog(null);
  }, []);

  const closeAlertDialog = useCallback(() => setActiveAlertDialog(null), []);

  // Helper function to render the active dialog
  const renderActiveAlertDialog = (alertDialog: ActiveAlertDialog) => {
    const AlertDialogComponent =
      ALERT_DIALOG_CONTENT_MAP[alertDialog.dialogType];

    // Type-safe rendering using the discriminated union
    return React.createElement(
      AlertDialogComponent as React.ComponentType<any>,
      alertDialog.payload,
    );
  };

  return (
    <AlertDialogsContext.Provider
      value={{
        setActiveAlertDialog: setActiveAlertDialogTyped,
        closeAlertDialog,
      }}
    >
      <AlertDialog
        open={activeAlertDialog !== null}
        onOpenChange={onOpenChange}
      >
        <AlertDialogPortal>
          {activeAlertDialog
            ? renderActiveAlertDialog(activeAlertDialog)
            : null}
        </AlertDialogPortal>
        {children}
      </AlertDialog>
    </AlertDialogsContext.Provider>
  );
};
