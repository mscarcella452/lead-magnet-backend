"use client";

import {
  useState,
  useId,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  isValidElement,
  type ReactNode,
  type ComponentProps,
  type ForwardRefExoticComponent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from ".";
import { RemoveScroll } from "react-remove-scroll";

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TRANSITION: Transition = { duration: 0.3 };

const ALIGNMENT_CLASSES = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
} as const;

const SIDE_CLASSES = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
  fromTop: "top-0",
  fromBottom: "bottom-0",
} as const;

// ============================================================================
// Types
// ============================================================================

type Alignment = keyof typeof ALIGNMENT_CLASSES;
type Side = keyof typeof SIDE_CLASSES;

type PopoverContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  uniqueId: string;
  labelId: string;
  variants?: Variants;
};

export type MorphingPopoverProps = {
  children: ReactNode;
  transition?: Transition;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variants?: Variants;
  className?: string;
} & ComponentProps<"div">;

export type MorphingPopoverTriggerProps = {
  /**
   * When true, the trigger merges its props onto its immediate child element
   * instead of rendering a wrapper <Button>. The child must forward refs.
   */
  asChild?: boolean;
  /**
   * When true (default), the trigger participates in the shared layoutId
   * animation so it morphs into the popover panel.
   */
  isLayoutTrigger?: boolean;
  children: ReactNode;
  className?: string;
} & ButtonProps;

export type MorphingPopoverContentProps = {
  children: ReactNode;
  className?: string;
  align?: Alignment;
  side?: Side;
  onClickOutside?: () => void;
  /** When true, prevents closing the popover when clicking outside. Useful for alert dialogs. */
  disableClickOutside?: boolean;
} & ComponentProps<typeof motion.div>;

// ============================================================================
// Context
// ============================================================================

const PopoverContext = createContext<PopoverContextValue | null>(null);

/** Throws a descriptive error when a child is rendered outside the provider. */
function usePopoverContext(componentName: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(`<${componentName}> must be used within <MorphingPopover>`);
  }
  return ctx;
}

// ============================================================================
// Internal hook – popover open/close state
// ============================================================================

type UsePopoverLogicOptions = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function usePopoverLogic({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: UsePopoverLogicOptions = {}): PopoverContextValue {
  const uniqueId = useId();
  const labelId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const isControlled = controlledOpen !== undefined;

  const open = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  return {
    isOpen,
    open,
    close,
    uniqueId,
    labelId: `popover-label-${labelId}`,
  };
}

// ============================================================================
// MorphingPopover (Root)
// ============================================================================

/**
 * Root wrapper that provides context and animation configuration.
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage patterns.
 */
function MorphingPopover({
  children,
  transition = DEFAULT_TRANSITION,
  defaultOpen,
  open,
  onOpenChange,
  variants,
  className,
  ...divProps
}: MorphingPopoverProps) {
  const logic = usePopoverLogic({ defaultOpen, open, onOpenChange });

  return (
    <PopoverContext.Provider value={{ ...logic, variants }}>
      <MotionConfig transition={transition}>
        <div
          className={cn("relative flex items-center justify-center", className)}
          {...divProps}
        >
          {children}
        </div>
      </MotionConfig>
    </PopoverContext.Provider>
  );
}

// ============================================================================
// MorphingPopoverTrigger
// ============================================================================

/**
 * Trigger that opens the popover.
 *
 * - Default: renders a `<Button>` with a motion wrapper.
 * - `asChild`: clones props onto its single child element (Radix-style
 *   composition). The child must be a forward-ref component.
 * - `isLayoutTrigger={false}`: hides the trigger while the popover is open
 *   and skips the shared layoutId so no morph animation occurs.
 */
function MorphingPopoverTrigger({
  children,
  className,
  asChild = false,
  isLayoutTrigger = true,
  ...buttonProps
}: MorphingPopoverTriggerProps) {
  const { isOpen, open, uniqueId, labelId } = usePopoverContext(
    "MorphingPopoverTrigger",
  );

  const layoutId = isLayoutTrigger ? `popover-trigger-${uniqueId}` : undefined;
  const contentId = `popover-content-${uniqueId}`;

  if (asChild && isValidElement(children)) {
    // Narrow the child props so we can safely spread them.
    const childProps = children.props as Record<string, unknown>;
    const MotionChild = motion.create(
      children.type as ForwardRefExoticComponent<Record<string, unknown>>,
    );

    return (
      <MotionChild
        {...childProps}
        layoutId={layoutId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={(e: ReactMouseEvent) => {
          if (typeof childProps.onClick === "function") {
            (childProps.onClick as (e: ReactMouseEvent) => void)(e);
          }
          open();
        }}
      />
    );
  }

  // Non-layout triggers disappear while the popover is open.
  if (isOpen && !isLayoutTrigger) return null;

  return (
    <motion.div layoutId={layoutId} onClick={open}>
      <Button
        className={className}
        aria-expanded={isOpen}
        aria-controls={contentId}
        {...buttonProps}
      >
        {/* Animate the label text separately for a smoother morph. */}
        <motion.span layoutId={labelId} className="flex items-center gap-2">
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}

// ============================================================================
// MorphingPopoverAnchor
// ============================================================================

/**
 * An invisible layout anchor that shares the trigger's layoutId without
 * rendering a visible trigger. Useful when you want to attach the morph
 * animation to a custom element (e.g. a dropdown menu trigger) instead of
 * using MorphingPopoverTrigger directly.
 * 
 * usage example:
 * 
 *  <DropdownMenuTrigger asChild>
        <Button
          intent="ghost-text"
          mode="iconOnly"
          aria-label="More options"
          className="relative"
        >
          <MorphingPopoverAnchor />
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
 */

function MorphingPopoverAnchor({ className }: { className?: string }) {
  const { uniqueId } = usePopoverContext("MorphingPopoverAnchor");

  return (
    <motion.span
      layoutId={`popover-trigger-${uniqueId}`}
      aria-hidden="true"
      className={cn("absolute inset-0 opacity-0", className)}
    />
  );
}

// ============================================================================
// MorphingPopoverContent
// ============================================================================

/**
 * Animated panel that appears when the popover is open.
 * Handles:
 * - Click-outside to close (via `useClickOutside`)
 * - Escape-key to close
 * - ARIA `dialog` role with `aria-modal`
 * - Scroll-lock via `RemoveScroll`
 */
function MorphingPopoverContent({
  children,
  className,
  align = "center",
  side = "bottom",
  onClickOutside,
  disableClickOutside = false,
  ...motionProps
}: MorphingPopoverContentProps) {
  const { isOpen, close, uniqueId, variants } = usePopoverContext(
    "MorphingPopoverContent",
  );

  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    onClickOutside?.();
    close();
  }, [close, onClickOutside]);

  useClickOutside(ref, handleClickOutside, { disabled: disableClickOutside });

  // Close on Escape – only register while open (unless disableClickOutside is true).
  useEffect(() => {
    if (!isOpen || disableClickOutside) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, disableClickOutside]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={ref}
          layoutId={`popover-trigger-${uniqueId}`}
          id={`popover-content-${uniqueId}`}
          role="dialog"
          aria-modal="true"
          className={cn(
            "absolute  overflow-hidden rounded-md border bg-popover shadow-sm dark:shadow-lg",
            ALIGNMENT_CLASSES[align],
            SIDE_CLASSES[side],
            className,
          )}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          {...motionProps}
        >
          <RemoveScroll>{children}</RemoveScroll>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  MorphingPopover,
  MorphingPopoverTrigger,
  MorphingPopoverAnchor,
  MorphingPopoverContent,
  usePopoverContext,
};
