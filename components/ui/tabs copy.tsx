"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/index";
import { Button, ButtonProps } from "@/components/ui/controls";
import { controlVariants } from "@/design-system/cva-variants/control-variants";
import { ControlVariantProps } from "@/design-system/lib/types/cva-types";

/**
 * Tabs — Radix UI Tabs wrapped with:
 *  - A React context that exposes `activeTab` to any descendant
 *  - Animated active-indicator via Framer Motion
 *  - CVA-driven style variants on the trigger's active state
 *
 * Usage:
 *   <Tabs defaultValue="overview">
 *     <TabsList>
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="details">Details</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *   </Tabs>
 *
 *   // Anywhere inside <Tabs>:
 *   const { activeTab } = useTabsContext();
 */

// ==========================================================================
// Types
// ==========================================================================

/** Shape of the shared tabs context value. */
interface TabsContextValue {
  /** The currently active tab value, or undefined before the first render. */
  activeTab: string | undefined;
}

/**
 * Props accepted by TabsTrigger in addition to the base Radix + Button props.
 * `isActive` and `activeProps` control the animated indicator's appearance.
 */
interface TabsTriggerExtendedProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    Omit<ButtonProps, "value"> {
  /** Whether this trigger is the currently selected tab. */
  isActive?: boolean;
  /** CVA variant overrides applied to the animated active indicator span. */
  activeVariant?: ControlVariantProps["variant"];
  activeIntent?: ControlVariantProps["intent"];
  ariaLabel: string;
}

// ==========================================================================
// Context
// ==========================================================================

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: undefined,
});

/**
 * useTabsContext
 *
 * Consume the shared tabs context. Must be used inside a <Tabs> component.
 *
 * @example
 * const { activeTab } = useTabsContext();
 */
export const useTabsContext = (): TabsContextValue =>
  React.useContext(TabsContext);

// ==========================================================================
// Tabs (root)
// ==========================================================================

/**
 * Tabs
 *
 * Wraps Radix's Root with a context provider that tracks `activeTab`.
 * Accepts all standard Radix Root props; `value` / `defaultValue` are used
 * to seed the initial active-tab state.
 */
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
  // Uncontrolled: track internally. Controlled: mirror the prop.
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    controlledValue ?? defaultValue,
  );

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setActiveTab(newValue);
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  // Keep internal state in sync with controlled or default value changes.
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setActiveTab(controlledValue);
    } else if (defaultValue !== undefined) {
      setActiveTab(defaultValue);
    }
  }, [controlledValue, defaultValue]);

  return (
    <TabsContext.Provider value={{ activeTab }}>
      <TabsPrimitive.Root
        ref={ref}
        value={controlledValue}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </TabsContext.Provider>
  );
});
Tabs.displayName = "Tabs";

// ==========================================================================
// TabsList
// ==========================================================================

/**
 * TabsList
 *
 * The container for tab triggers. Styled as a pill-shaped muted bar.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// ==========================================================================
// TabsTrigger
// ==========================================================================

/**
 * Spring config for the animated active-tab indicator.
 * Defined outside the component to avoid object recreation on each render.
 */
const INDICATOR_TRANSITION = { type: "spring", duration: 0.5 } as const;

/**
 * TabsTrigger
 *
 * A tab button that renders a shared animated indicator (layoutId="tabs")
 * when active. The indicator slides between triggers via Framer Motion's
 * layout animation, giving a smooth "pill follows selection" effect.
 *
 * `isActive` should be derived from the parent's active tab value:
 *   <TabsTrigger value="overview" isActive={activeTab === "overview"} />
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerExtendedProps
>(
  (
    {
      className,
      value,
      isActive,
      activeVariant = "brand",
      activeIntent = "solid",
      children,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        value={value}
        className={cn(
          "relative w-full",
          controlVariants({
            variant: props.variant || "primary",
            intent: props.intent || "soft",
            size: props.size,
            mode: props.mode,
            radius: props.radius,
            focus: "outline",
          }),
          className,
        )}
        aria-label={ariaLabel}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isActive && (
            <motion.span
              layoutId="tabs"
              transition={INDICATOR_TRANSITION}
              className={cn(
                controlVariants({
                  variant: activeVariant,
                  intent: activeIntent,
                  size: props.size,
                  radius: props.radius,
                }),
                "absolute inset-0 h-full z-1",
              )}
              // Hide from screen readers — the trigger itself conveys state
              aria-hidden="true"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>

        <span
          className={cn(
            "absolute inset-0 flex flex-row items-center gap-2 justify-center",
          )}
          aria-hidden="true"
        >
          {children}
        </span>
      </TabsPrimitive.Trigger>
    );
  },
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ==========================================================================
// TabsContent
// ==========================================================================

/**
 * TabsContent
 *
 * Panel shown when its associated trigger is active.
 * Includes focus-visible ring styles for keyboard accessibility.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ==========================================================================
// Exports
// ==========================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsContextValue, TabsTriggerExtendedProps };
