"use client";

import {
  useState,
  useId,
  useRef,
  useEffect,
  createContext,
  useContext,
  isValidElement,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  Transition,
  Variants,
} from "motion/react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/controls";
import { RemoveScroll } from "react-remove-scroll";

// ============================================================================
// Constants
// ============================================================================

const TRANSITION = {
  duration: 0.3,
} as Transition;
// const TRANSITION = {
//   type: "spring",
//   bounce: 0.25,
//   duration: 0.4,
// } as Transition;

// ============================================================================
// Types
// ============================================================================

type MorphingPopoverContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  uniqueId: string;
  uniqueLabelId: string;
  variants?: Variants;
};

export type MorphingPopoverProps = {
  children: React.ReactNode;
  transition?: Transition;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variants?: Variants;
  className?: string;
} & React.ComponentProps<"div">;

export interface MorphingPopoverTriggerProps extends ButtonProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  isLayoutTrigger?: boolean;
}

export type MorphingPopoverContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  side?: "top" | "bottom" | "fromTop" | "fromBottom";
  onClickOutside?: () => void;
} & React.ComponentProps<typeof motion.div>;

// ============================================================================
// Context
// ============================================================================

const MorphingPopoverContext =
  createContext<MorphingPopoverContextValue | null>(null);

// ============================================================================
// Hooks
// ============================================================================

/**
 * Internal hook to manage popover open/close state.
 * Supports both controlled and uncontrolled modes.
 */
function usePopoverLogic({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const uniqueId = useId();
  const uniqueID_label = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isOpen = controlledOpen ?? uncontrolledOpen;

  const open = () => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(true);
    }
    onOpenChange?.(true);
  };

  const close = () => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(false);
    }
    onOpenChange?.(false);
  };

  const uniqueLabelId = `popover-label-${uniqueID_label}`;

  return { isOpen, open, close, uniqueId, uniqueLabelId };
}

// ============================================================================
// MorphingPopover
/**
 * Root component for the morphing popover.
 * Provides context and animation configuration for trigger and content.
 */
// ============================================================================

function MorphingPopover({
  children,
  transition = TRANSITION,
  defaultOpen,
  open,
  onOpenChange,
  variants,
  className,
  ...props
}: MorphingPopoverProps) {
  const popoverLogic = usePopoverLogic({ defaultOpen, open, onOpenChange });

  return (
    <MorphingPopoverContext.Provider value={{ ...popoverLogic, variants }}>
      <MotionConfig transition={transition}>
        <div
          className={cn("relative flex items-center justify-center", className)}
          key={popoverLogic.uniqueId}
          {...props}
        >
          {children}
        </div>
      </MotionConfig>
    </MorphingPopoverContext.Provider>
  );
}

// ============================================================================
// MorphingPopoverTrigger
/**
 * Trigger button for the morphing popover.
 * Can render as child element using asChild prop for composition.
 */
// ============================================================================

function MorphingPopoverTrigger({
  children,
  className,
  asChild = false,
  isLayoutTrigger = true,
  ...props
}: MorphingPopoverTriggerProps) {
  const context = useContext(MorphingPopoverContext);
  if (!context) {
    throw new Error(
      "MorphingPopoverTrigger must be used within MorphingPopover",
    );
  }

  const { isOpen, open, uniqueId, uniqueLabelId } = context;

  const layoutId = isLayoutTrigger ? `popover-trigger-${uniqueId}` : undefined;
  const ariaControls = `popover-content-${uniqueId}`;

  if (asChild && isValidElement(children)) {
    const MotionComponent = motion.create(
      children.type as React.ForwardRefExoticComponent<any>,
    );
    const childProps = children.props as Record<string, unknown>;

    return (
      <MotionComponent
        {...childProps}
        onClick={(e: React.MouseEvent) => {
          if (typeof childProps.onClick === "function") {
            childProps.onClick(e);
          }
          open();
        }}
        layoutId={layoutId}
        className={childProps.className}
        key={uniqueId}
        aria-expanded={isOpen}
        aria-controls={ariaControls}
      />
    );
  }

  // Hide trigger when popover is open
  if (isOpen && !isLayoutTrigger) return null;

  return (
    <motion.div key={uniqueId} onClick={open} layoutId={layoutId}>
      <Button {...props} aria-expanded={isOpen} aria-controls={ariaControls}>
        <motion.span
          layoutId={uniqueLabelId}
          className="flex items-center gap-2"
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}

// ============================================================================
// MorphingPopoverContent
/**
 * Content container for the morphing popover.
 * Handles click-outside, escape key, and accessibility attributes.
 */
// ============================================================================

function MorphingPopoverContent({
  children,
  className,
  align = "center",
  side = "bottom",
  onClickOutside,
  ...props
}: MorphingPopoverContentProps) {
  const context = useContext(MorphingPopoverContext);
  if (!context)
    throw new Error(
      "MorphingPopoverContent must be used within MorphingPopover",
    );

  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, close, uniqueId, variants } = context;

  const handleOnClickOutside = () => {
    onClickOutside?.();
    close();
  };

  useClickOutside(ref, handleOnClickOutside);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  } satisfies Record<typeof align, string>;

  const sideClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    fromTop: "top-0",
    fromBottom: "bottom-0",
  } satisfies Record<typeof side, string>;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            {...props}
            ref={ref}
            layoutId={`popover-trigger-${uniqueId}`}
            key={uniqueId}
            id={`popover-content-${uniqueId}`}
            role="dialog"
            aria-modal="true"
            className={cn(
              "absolute overflow-hidden rounded-md border bg-popover shadow-sm dark:shadow-lg z-50",
              alignmentClasses[align],
              sideClasses[side],
              className,
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
          >
            <RemoveScroll>{children}</RemoveScroll>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverContent,
  MorphingPopoverContext,
};
