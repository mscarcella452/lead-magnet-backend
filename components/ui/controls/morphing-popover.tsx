"use client";

import {
  useState,
  useId,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  useMemo,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ComponentProps,
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
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/controls";
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
  /** Unique suffix used to build stable aria/layout IDs. */
  uid: string;
  /** Stable aria-labelledby ID pointing to the trigger label. */
  labelId: string;
  /** Optional custom animation variants passed from the root. */
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
   * Merges props onto the child element instead of wrapping in a `<Button>`.
   * The child must forward refs.
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
  /** Prevents closing on outside click — useful for alert-style dialogs. */
  disableClickOutside?: boolean;
} & ComponentProps<typeof motion.div>;

// ============================================================================
// Context
// ============================================================================

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(componentName: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new Error(`<${componentName}> must be used within <MorphingPopover>`);
  }
  return ctx;
}

// ============================================================================
// Hooks
// ============================================================================

function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void,
  disabled = false,
): void {
  // Keep handler in a ref so the effect never needs to re-subscribe.
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (disabled) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handlerRef.current();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, disabled]);
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
}

/**
 * Traps focus inside `ref` while `active` is true, and restores focus to the
 * previously focused element on cleanup.
 *
 * Two mechanisms work together:
 * 1. `keydown` — intercepts Tab at the first/last boundary to cycle within the panel.
 * 2. `focusin` — if focus somehow escapes (e.g. before the initial move lands),
 *    pulls it back to the first focusable element in the panel.
 */
function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return;

    const previous = document.activeElement as HTMLElement | null;

    // Move focus synchronously so the trap is effective immediately.
    // Fall back to the panel itself so it at least receives keyboard events.
    const focusable = ref.current
      ? (getFocusables(ref.current)[0] ?? ref.current)
      : null;
    focusable?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !ref.current) return;
      const focusables = getFocusables(ref.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Pull focus back if it leaves the panel for any reason.
    // The `redirecting` flag prevents the `.focus()` call below from
    // re-triggering this listener and causing an infinite loop.
    let redirecting = false;
    const onFocusIn = (e: FocusEvent) => {
      if (redirecting) return;
      if (ref.current && !ref.current.contains(e.target as Node)) {
        redirecting = true;
        const focusables = getFocusables(ref.current);
        (focusables[0] ?? ref.current).focus();
        redirecting = false;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      previous?.focus();
    };
  }, [ref, active]);
}

// ============================================================================
// MorphingPopover (Root)
// ============================================================================

/**
 * Root wrapper. Supports controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) patterns.
 */
function MorphingPopover({
  children,
  transition = DEFAULT_TRANSITION,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  variants,
  className,
  ...divProps
}: MorphingPopoverProps) {
  const rawUid = useId();
  // Strip React's colon-wrapped format to make safe HTML id strings.
  const uid = rawUid.replace(/:/g, "");
  const labelId = `popover-label-${uid}`;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen! : uncontrolledOpen;

  const open = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(true);
    onOpenChange?.(true);
  }, [isControlled, onOpenChange]);

  const close = useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  // Stable context value — only recalculates when meaningful values change.
  const ctx = useMemo<PopoverContextValue>(
    () => ({ isOpen, open, close, uid, labelId, variants }),
    [isOpen, open, close, uid, labelId, variants],
  );

  return (
    <PopoverContext.Provider value={ctx}>
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
 * Button that opens the popover.
 *
 * - Default: a `<Button>` wrapped in a motion div that morphs into the panel.
 * - `asChild`: clones its single child element, merging trigger props onto it.
 * - `isLayoutTrigger={false}`: hides while open and skips the morph animation.
 */
function MorphingPopoverTrigger({
  children,
  className,
  asChild = false,
  isLayoutTrigger = true,
  ...buttonProps
}: MorphingPopoverTriggerProps) {
  const { isOpen, open, uid, labelId } = usePopoverContext(
    "MorphingPopoverTrigger",
  );
  const layoutId = isLayoutTrigger ? `popover-trigger-${uid}` : undefined;
  const contentId = `popover-content-${uid}`;

  const sharedAriaProps = {
    "aria-expanded": isOpen,
    "aria-haspopup": "dialog" as const,
    "aria-controls": contentId,
  };

  if (asChild && isValidElement<Record<string, unknown>>(children)) {
    // Merge trigger behaviour onto the child without an extra DOM node.
    return cloneElement(children, {
      ...sharedAriaProps,
      onClick: (e: ReactMouseEvent) => {
        if (typeof children.props.onClick === "function") {
          (children.props.onClick as (e: ReactMouseEvent) => void)(e);
        }
        open();
      },
    });
  }

  if (isOpen && !isLayoutTrigger) return null;

  return (
    <motion.div layoutId={layoutId} onClick={open}>
      <Button className={className} {...sharedAriaProps} {...buttonProps}>
        <motion.span
          layoutId={labelId}
          id={labelId}
          className="flex items-center gap-2"
        >
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
 * An invisible motion element that shares the trigger's `layoutId`.
 * Attach this inside a custom trigger (e.g. a dropdown button) to participate
 * in the morph animation without rendering a `MorphingPopoverTrigger`.
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger asChild>
 *   <Button mode="iconOnly" aria-label="More options" className="relative">
 *     <MorphingPopoverAnchor />
 *     <EllipsisVerticalIcon />
 *   </Button>
 * </DropdownMenuTrigger>
 * ```
 */
function MorphingPopoverAnchor({ className }: { className?: string }) {
  const { uid } = usePopoverContext("MorphingPopoverAnchor");
  return (
    <motion.span
      layoutId={`popover-trigger-${uid}`}
      aria-hidden="true"
      className={cn("absolute inset-0 opacity-0", className)}
    />
  );
}

// ============================================================================
// MorphingPopoverContent
// ============================================================================

/**
 * Animated popover panel. Handles:
 * - Click-outside to close
 * - Escape key to close
 * - Focus trap (Tab / Shift+Tab cycle within the panel)
 * - Focus restoration on close
 * - ARIA `dialog` role with `aria-modal` and `aria-labelledby`
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
  const { isOpen, close, uid, labelId, variants } = usePopoverContext(
    "MorphingPopoverContent",
  );
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => {
    onClickOutside?.();
    close();
  }, [close, onClickOutside]);

  useClickOutside(ref, handleClickOutside, disableClickOutside || !isOpen);

  useFocusTrap(ref, isOpen);

  // Escape key — only wire up while open.
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
          layoutId={`popover-trigger-${uid}`}
          id={`popover-content-${uid}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className={cn(
            "absolute overflow-hidden rounded-md border bg-popover shadow-sm dark:shadow-lg",
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
