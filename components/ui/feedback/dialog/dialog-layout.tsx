"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { Overlay } from "@/components/ui/feedback/overlay";
import { cn } from "@/lib/utils/classnames";
import {
  dialogLayoutVariants,
  dialogContentVariants,
} from "@/design-system/cva-variants/dialog-variants";
import { useDialogContext } from "./dialog-context";
import { DIALOG_ANIMATION_MAP } from "@/config/dialog-config";
import {
  DialogLayoutVariantProps,
  DialogContentVariantProps,
} from "@/design-system/lib/types/cva-types";
import { ButtonProps } from "@/components/ui/controls/button";
import { useDialogs } from "@/components/dialogs/providers";

// ============================================================================
// DialogOverlay - Backdrop overlay
// ============================================================================

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay asChild {...props}>
    <Overlay ref={ref} className={className} />
  </DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ============================================================================
// DialogPortal - Portal with entrance/exit animations
// ============================================================================

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open, onExitComplete } = useDialogContext();

  return (
    <DialogPrimitive.Portal>
      <AnimatePresence onExitComplete={onExitComplete} mode="wait">
        {open && (
          <>
            <DialogOverlay />
            {children}
          </>
        )}
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
};
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// ============================================================================
// DialogContent - Main content container with close button
// ============================================================================

interface DialogContentProps
  extends DialogLayoutVariantProps, DialogContentVariantProps {
  contentClassName?: string;
  contentRef?: React.Ref<HTMLDivElement>;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    DialogContentProps
>(
  (
    {
      className,
      contentClassName,
      children,
      enterFrom,
      variant,
      layout,
      spacing,
      rounded,
      border,
      contentRef,
      ...props
    },
    ref,
  ) => {
    const { handleClose, onEntranceComplete } = useDialogContext();

    const currentMotion = DIALOG_ANIMATION_MAP[enterFrom ?? "bottom"];
    const internalContentRef = React.useRef<HTMLDivElement>(null);
    const resolvedContentRef = contentRef ?? internalContentRef;

    return (
      <motion.div
        {...currentMotion}
        transition={{ duration: 0.4 }}
        onAnimationComplete={onEntranceComplete}
        className="fixed flex inset-0 z-50 @container"
      >
        <DialogPrimitive.Content
          ref={ref}
          onInteractOutside={handleClose}
          onPointerDownOutside={handleClose}
          onEscapeKeyDown={handleClose}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...props}
          className={cn(
            dialogLayoutVariants({
              enterFrom,
              layout,
              rounded,
              border,
            }),

            "overflow-hidden relative grid",
            className,
          )}
        >
          <div
            ref={resolvedContentRef}
            className={cn(
              dialogContentVariants({
                variant,
                spacing,
              }),
              "overflow-y-auto h-full",
              contentClassName,
            )}
          >
            {children}
          </div>
        </DialogPrimitive.Content>
      </motion.div>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// ============================================================================
// Exports
// ============================================================================

export { DialogOverlay, DialogPortal, DialogContent };
