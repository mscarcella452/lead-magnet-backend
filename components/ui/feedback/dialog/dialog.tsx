"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useDialogs } from "@/components/dialogs/providers";
import { ActiveDialog } from "@/types/ui/dialog";
import {
  DialogContext,
  dialogReducer,
  type DialogState,
} from "./dialog-context";

// ============================================================================
// Dialog Root
// ============================================================================

type DialogProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExitComplete?: () => void;
};

const Dialog = ({
  open,
  onOpenChange,
  onExitComplete,
  children,
  ...props
}: DialogProps) => {
  const initialState: DialogState = {
    shouldRender: open ?? false,
    animationPhase: open ? "entering" : "idle",
  };

  const [state, dispatch] = React.useReducer(dialogReducer, initialState);

  React.useEffect(() => {
    if (open) {
      dispatch({ type: "OPEN" });
    } else if (state.animationPhase !== "idle") {
      dispatch({ type: "CLOSE" });
    }
  }, [open, state.animationPhase]);

  const handleClose = () => dispatch({ type: "CLOSE" });
  const handleEntranceComplete = () => dispatch({ type: "ENTRANCE_COMPLETE" });
  // const handleExitComplete = () => dispatch({ type: "EXIT_COMPLETE" });
  const handleExitComplete = () => {
    dispatch({ type: "EXIT_COMPLETE" });
    onExitComplete?.();
  };

  return (
    <DialogPrimitive.Root
      open={state.shouldRender}
      onOpenChange={onOpenChange}
      {...props}
    >
      <DialogContext.Provider
        value={{
          open,
          handleClose,
          onEntranceComplete: handleEntranceComplete,
          onExitComplete: handleExitComplete,
          animateChildren: state.animationPhase === "stable",
          isIdle: state.animationPhase === "idle",
        }}
      >
        {children}
      </DialogContext.Provider>
    </DialogPrimitive.Root>
  );
};
Dialog.displayName = "Dialog";

// ============================================================================
// DialogTrigger - Smart trigger that opens dialogs via context
// ============================================================================

type DialogTriggerProps = (
  | ActiveDialog
  | {
      dialogType?: undefined;
      payload?: never;
    }
) &
  Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
    "dialogType" | "payload"
  >;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>(({ dialogType, payload, onClick, ...props }, ref) => {
  const { setActiveDialog } = useDialogs();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (dialogType) {
      setActiveDialog(dialogType, payload);
    }
    onClick?.(e);
  };

  return <DialogPrimitive.Trigger ref={ref} onClick={handleClick} {...props} />;
});

DialogTrigger.displayName = "DialogTrigger";

// ============================================================================
// Exports
// ============================================================================

export { Dialog, DialogTrigger };
