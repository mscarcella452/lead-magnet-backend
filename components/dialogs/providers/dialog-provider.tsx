"use client";
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Dialog, DialogPortal } from "@/components/ui/feedback/dialog";
import { usePathname } from "next/navigation";
import React from "react";
import { DialogType, DialogPayloads, ActiveDialog } from "@/types/ui/dialog";
import { DIALOG_CONTENT_MAP } from "@/config/dialog-config";

// ============================================================================
// Context types
// ============================================================================

export type SetActiveDialog = <T extends DialogType>(
  dialogType: T,
  payload?: DialogPayloads[T] extends never ? never : DialogPayloads[T],
) => void;

interface DialogsContextType {
  setActiveDialog: SetActiveDialog;
  closeDialog: () => void;
  switchActiveDialog: SetActiveDialog;
}

// ============================================================================
// Context & Hook
// ============================================================================

const DialogsContext = createContext<DialogsContextType | null>(null);

export const useDialogs = () => {
  const context = useContext(DialogsContext);
  if (!context) {
    throw new Error("useDialogs must be used within DialogsProvider");
  }
  return context;
};

// ============================================================================
// DialogsProvider - Manages dialog state and rendering
// ============================================================================
export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const pendingDialogRef = React.useRef<ActiveDialog | null>(null);

  const pathname = usePathname();

  // Close dialog on route change
  useEffect(() => {
    setActiveDialog(null);
  }, [pathname]);

  const setActiveDialogTyped = useCallback<SetActiveDialog>(
    (dialogType, payload) => {
      setActiveDialog({ dialogType, payload } as ActiveDialog);
    },
    [],
  );

  const switchActiveDialog = useCallback<SetActiveDialog>(
    (dialogType, payload) => {
      if (activeDialog !== null) {
        pendingDialogRef.current = { dialogType, payload } as ActiveDialog;
        setActiveDialog(null);
      } else {
        setActiveDialog({ dialogType, payload } as ActiveDialog);
      }
    },
    [activeDialog],
  );

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) setActiveDialog(null);
  }, []);

  const closeDialog = useCallback(() => setActiveDialog(null), []);

  const handleExitComplete = useCallback(() => {
    if (pendingDialogRef.current) {
      setActiveDialog(pendingDialogRef.current);
      pendingDialogRef.current = null;
    }
  }, []);

  const renderActiveDialog = (dialog: ActiveDialog) => {
    const DialogComponent = DIALOG_CONTENT_MAP[dialog.dialogType];
    return React.createElement(
      DialogComponent as React.ComponentType<any>,
      dialog.payload,
    );
  };

  return (
    <DialogsContext.Provider
      value={{
        setActiveDialog: setActiveDialogTyped,
        switchActiveDialog,
        closeDialog,
      }}
    >
      <Dialog
        open={activeDialog !== null}
        onOpenChange={onOpenChange}
        onExitComplete={handleExitComplete}
      >
        <DialogPortal>
          {activeDialog ? renderActiveDialog(activeDialog) : null}
        </DialogPortal>
        {children}
      </Dialog>
    </DialogsContext.Provider>
  );
};
