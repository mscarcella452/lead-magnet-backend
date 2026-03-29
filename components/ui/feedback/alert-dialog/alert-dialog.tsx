"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useAlertDialogs } from "@/components/dialogs/providers";
import { ActiveAlertDialog, AlertDialogType, AlertDialogPayloads } from "@/types/ui/dialog";
import {
  AlertDialogContext,
  alertDialogReducer,
  type AlertDialogState,
} from "./alert-dialog-context";

// ============================================================================
// AlertDialog Root
// ============================================================================

type AlertDialogProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AlertDialog = ({
  open,
  onOpenChange,
  children,
  ...props
}: AlertDialogProps) => {
  const initialState: AlertDialogState = {
    shouldRender: open ?? false,
    animationPhase: open ? "entering" : "idle",
  };

  const [state, dispatch] = React.useReducer(alertDialogReducer, initialState);

  React.useEffect(() => {
    if (open) {
      dispatch({ type: "OPEN" });
    } else if (state.animationPhase !== "idle") {
      dispatch({ type: "CLOSE" });
    }
  }, [open, state.animationPhase]);

  const handleEntranceComplete = () => dispatch({ type: "ENTRANCE_COMPLETE" });
  const handleExitComplete = () => dispatch({ type: "EXIT_COMPLETE" });

  return (
    <AlertDialogPrimitive.Root
      open={state.shouldRender}
      onOpenChange={onOpenChange}
      {...props}
    >
      <AlertDialogContext.Provider
        value={{
          open,
          onEntranceComplete: handleEntranceComplete,
          onExitComplete: handleExitComplete,
          animateChildren: state.animationPhase === "stable",
        }}
      >
        {children}
      </AlertDialogContext.Provider>
    </AlertDialogPrimitive.Root>
  );
};
AlertDialog.displayName = "AlertDialog";

// ============================================================================
// AlertDialogTrigger - Smart trigger that opens alert dialogs via context
// ============================================================================

type AlertDialogTriggerProps<T extends AlertDialogType | undefined = AlertDialogType | undefined> = (
  T extends AlertDialogType
    ? AlertDialogPayloads[T] extends never
      ? {
          dialogType: T;
          payload?: never;
        }
      : {
          dialogType: T;
          payload: AlertDialogPayloads[T];
        }
    : {
        dialogType?: undefined;
        payload?: never;
      }
) &
  Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>,
    "dialogType" | "payload"
  >;

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  AlertDialogTriggerProps
>(({ dialogType, payload, onClick, ...props }, ref) => {
  const { setActiveAlertDialog } = useAlertDialogs();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (dialogType) {
      setActiveAlertDialog(dialogType, payload);
    }
    onClick?.(e);
  };

  return (
    <AlertDialogPrimitive.Trigger ref={ref} onClick={handleClick} {...props} />
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// ============================================================================
// Exports
// ============================================================================

export { AlertDialog, AlertDialogTrigger };
