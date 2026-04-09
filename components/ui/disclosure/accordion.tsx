"use client";

import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useId,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  Transition,
  HTMLMotionProps,
  Variants,
} from "motion/react";
import { AnimatedContentSwap } from "@/components/ui/animations/animated-content-swap";
import { cn } from "@/lib/utils/classnames";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Container } from "@/components/ui/layout/containers/container";
import { AccordionVariantProps } from "@/design-system/types/cva-types";
import { accordionVariants } from "@/design-system/cva-variants/accordion-variants";

// ============================================================================
// Constants & Configuration
// ============================================================================

const ACCORDION_CONFIG = {
  transition: { duration: 0.4 } as Transition,
  iconVariants: {
    initial: { opacity: 0, scale: 0.75 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.75 },
  },
  iconTransition: { duration: 0.2 } as Transition,
  contentVariants: {
    initial: { opacity: 0, y: 0, scale: 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.9 },
  },
} as const;

const DEFAULT_ICON_CONFIG = {
  collapsed: <ChevronDown />,
  expanded: <ChevronUp />,
  position: "end" as const,
} as const;

// ============================================================================
// Types
// ============================================================================

type AccordionType = "single" | "multiple";
type AccordionContentHeight = "auto" | "useMeasure";
type AccordionValue = string | number;

interface AccordionContextValue {
  openValues: AccordionValue[];
  toggleItem: (value: AccordionValue) => void;
  type: AccordionType;
  collapsible: boolean;
  contentHeight: AccordionContentHeight;
}

interface AccordionItemContextValue {
  value: AccordionValue;
  isExpanded: boolean;
  triggerId: string;
  contentId: string;
}

interface AccordionProps {
  children: ReactNode;
  type?: AccordionType;
  collapsible?: boolean;
  defaultValue?: AccordionValue | AccordionValue[] | null;
  className?: string;
  contentHeight?: AccordionContentHeight;
  onChangeActive?: (value: AccordionValue) => void;
}

interface AccordionItemProps extends AccordionVariantProps {
  value: AccordionValue;
  children: ReactNode;
  className?: string;
}

interface AccordionTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  children?: ReactNode;
  iconProps?: {
    collapsed?: ReactNode;
    expanded?: ReactNode;
    position?: "start" | "end";
  };
  titleClassName?: string;
}

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const AccordionContext = createContext<AccordionContextValue | undefined>(
  undefined,
);

const AccordionItemContext = createContext<
  AccordionItemContextValue | undefined
>(undefined);

// ============================================================================
// Hooks
// ============================================================================

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
}

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("useAccordionItem must be used within an AccordionItem");
  }
  return context;
}

// ============================================================================
// Helper Functions
// ============================================================================

function normalizeDefaultValue(
  defaultValue: AccordionValue | AccordionValue[] | null | undefined,
): AccordionValue[] {
  if (Array.isArray(defaultValue)) return defaultValue;
  if (defaultValue !== undefined && defaultValue !== null)
    return [defaultValue];
  return [];
}

function calculateNewOpenValues(
  currentValues: AccordionValue[],
  toggledValue: AccordionValue,
  type: AccordionType,
  collapsible: boolean,
): AccordionValue[] {
  if (type === "single") {
    const isSameValue = currentValues[0] === toggledValue;
    if (isSameValue) {
      return collapsible ? [] : currentValues;
    }
    return [toggledValue];
  }

  // Multiple type
  if (currentValues.includes(toggledValue)) {
    return currentValues.filter((v) => v !== toggledValue);
  }
  return [...currentValues, toggledValue];
}

// ============================================================================
// Accordion Root Component
// ============================================================================

function Accordion({
  children,
  type = "single",
  collapsible = true,
  defaultValue,
  className,
  contentHeight = "useMeasure",
  onChangeActive,
}: AccordionProps) {
  const [openValues, setOpenValues] = useState<AccordionValue[]>(() =>
    normalizeDefaultValue(defaultValue),
  );

  const toggleItem = useCallback(
    (value: AccordionValue) => {
      const newOpenValues = calculateNewOpenValues(
        openValues,
        value,
        type,
        collapsible,
      );

      setOpenValues(newOpenValues);

      // Notify parent of the active item (single mode only)
      if (type === "single" && newOpenValues[0] !== undefined) {
        onChangeActive?.(newOpenValues[0]);
      }
    },
    [openValues, type, collapsible, onChangeActive],
  );

  const contextValue = React.useMemo(
    () => ({
      openValues,
      toggleItem,
      type,
      collapsible,
      contentHeight,
    }),
    [openValues, toggleItem, type, collapsible, contentHeight],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <Container spacing={"group"} className={className}>
        {children}
      </Container>
    </AccordionContext.Provider>
  );
}

// ============================================================================
// Accordion Item Component
// ============================================================================

function AccordionItem({
  value,
  className,
  children,
  variant,
  border,
  size,
  ...props
}: AccordionItemProps) {
  const { openValues } = useAccordion();
  const triggerId = useId();
  const contentId = useId();
  const isExpanded = openValues.includes(value);

  const contextValue = React.useMemo(
    () => ({
      value,
      isExpanded,
      triggerId,
      contentId,
    }),
    [value, isExpanded, triggerId, contentId],
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div
        data-expanded={isExpanded}
        className={cn(
          "rounded-xl overflow-hidden",
          accordionVariants({ variant, border, size }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// ============================================================================
// Accordion Trigger Component
// ============================================================================

function AccordionTrigger({
  children,
  className,
  iconProps,
  titleClassName,
  ...props
}: AccordionTriggerProps) {
  const { toggleItem, collapsible } = useAccordion();
  const { value, isExpanded, triggerId, contentId } = useAccordionItem();

  const icon = { ...DEFAULT_ICON_CONFIG, ...iconProps };
  const isDisabled = !collapsible && isExpanded;

  const handleClick = useCallback(() => {
    toggleItem(value);
  }, [toggleItem, value]);

  return (
    <button
      id={triggerId}
      type="button"
      aria-expanded={isExpanded}
      aria-controls={contentId}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        // Base styles
        "w-full flex items-center justify-between gap-2 text-start",
        "text-sm font-medium sm:text-base",
        // Icon styles
        "[&_svg]:size-[1em] [&_svg]:shrink-0 [&_svg]:stroke-[1.75px]",
        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        // Interactive styles
        "cursor-pointer",

        "px-(--accordion-padding-x) py-(--accordion-padding-y)",
        {
          "cursor-default": isDisabled,
        },
        className,
      )}
      {...props}
    >
      {children}

      {!isDisabled && (
        <AnimatedContentSwap
          variants={ACCORDION_CONFIG.iconVariants}
          transition={ACCORDION_CONFIG.iconTransition}
          isActive={isExpanded}
          from={icon.collapsed}
          to={icon.expanded}
          aria-hidden={isDisabled || "true"}
          className={cn("shrink-0", {
            "order-first": icon.position === "start",
            "order-last": icon.position === "end",
          })}
        />
      )}
    </button>
  );
}

// ============================================================================
// Accordion Content Component
// ============================================================================

function AccordionContent({ className, children }: AccordionContentProps) {
  const { contentHeight } = useAccordion();
  const { isExpanded, contentId, triggerId } = useAccordionItem();

  const VARIANTS: Variants = {
    initial: { height: 0, opacity: 0, scale: 1, y: 0 },
    animate: { height: "auto", opacity: 1, scale: 1, y: 0 },
    exit: { height: 0, opacity: 0, scale: 0.9, y: 20 },
  };

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={VARIANTS}
          transition={{ duration: 0.4 }}
        >
          <div className="px-(--accordion-padding-x) pb-(--accordion-padding-y)">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useAccordion,
};

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionType,
  AccordionValue,
};
