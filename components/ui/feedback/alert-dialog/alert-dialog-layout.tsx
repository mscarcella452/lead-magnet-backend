"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Overlay } from "@/components/ui/feedback/overlay";
import { cn } from "@/lib/utils/classnames";
import { alertDialogVariants } from "@/design-system/cva-variants/alert-dialog-variants";
import { useAlertDialogContext } from "@/components/ui/feedback/alert-dialog/alert-dialog-context";
import { DIALOG_ANIMATION_MAP } from "@/config/dialog-config";
import { AlertDialogVariantProps } from "@/design-system/lib/types/cva-types";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

// ============================================================================
// AlertDialogOverlay - Backdrop overlay
// ============================================================================

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay asChild {...props}>
    <Overlay ref={ref} className={className} />
  </AlertDialogPrimitive.Overlay>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

// ============================================================================
// AlertDialogPortal - Portal with entrance/exit animations
// ============================================================================

const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open, onExitComplete } = useAlertDialogContext();
  return (
    <AlertDialogPrimitive.Portal>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <>
            <AlertDialogOverlay />
            {children}
          </>
        )}
      </AnimatePresence>
    </AlertDialogPrimitive.Portal>
  );
};
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

// ============================================================================
// AlertDialogContent - Main content container (no close button)
// ============================================================================

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> &
    AlertDialogVariantProps
>(
  (
    { className, children, variant, spacing, rounded, border, ...props },
    ref,
  ) => {
    const { onEntranceComplete } = useAlertDialogContext();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{
          type: "spring",
          damping: 20, // controls bounce; higher = less bounce
          stiffness: 200, // controls speed / rigidity; higher = snappier
          mass: 0.5, // optional, makes it feel lighter
        }}
        // transition={{ duration: 0.4 }}
        onAnimationComplete={onEntranceComplete}
        className="fixed flex inset-0 z-50 @container"
      >
        <AlertDialogPrimitive.Content
          ref={ref}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...props}
          className={cn(
            alertDialogVariants({
              variant,
              spacing,
              rounded,
              border,
            }),
            "overflow-hidden relative grid",
            className,
          )}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </motion.div>
    );
  },
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

// ============================================================================
// Exports
// ============================================================================

export { AlertDialogOverlay, AlertDialogPortal, AlertDialogContent };
