"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence, Variants } from "motion/react";
import { cn } from "@/lib/utils/index";
import { ButtonProps } from "@/components/ui/controls";
import { controlVariants } from "@/design-system/cva-variants/control-variants";
import { ControlVariantProps } from "@/design-system/lib/types/cva-types";

/**
 * Tabs — Radix UI Tabs wrapped with:
 *  - A React context that exposes `activeTab` and `direction` to any descendant
 *  - Animated active-indicator via Framer Motion on triggers
 *  - Animated slide + fade transitions on tab content panels
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
 *   const { activeTab, direction } = useTabsContext();
 */

// ==========================================================================
// Types
// ==========================================================================

/** Shape of the shared tabs context value. */
interface TabsContextValue {
  /** The currently active tab value, or undefined before the first render. */
  activeTab: string | undefined;
  /**
   * Direction of the last tab change.
   * - `1`  → moved to a later tab (animate in from the right)
   * - `-1` → moved to an earlier tab (animate in from the left)
   * - `0`  → initial render, no directional animation
   */
  direction: 1 | -1 | 0;
  /** Ordered list of tab values, used to derive direction. */
  registerTab: (value: string) => void;
}

interface TabsTriggerExtendedProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    Omit<ButtonProps, "value"> {
  isActive?: boolean;
  activeVariant?: ControlVariantProps["variant"];
  activeIntent?: ControlVariantProps["intent"];
  ariaLabel: string;
}

// ==========================================================================
// Context
// ==========================================================================

const TabsContext = React.createContext<TabsContextValue>({
  activeTab: undefined,
  direction: 0,
  registerTab: () => {},
});

export const useTabsContext = (): TabsContextValue =>
  React.useContext(TabsContext);

// ==========================================================================
// Tabs (root)
// ==========================================================================

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState<string | undefined>(
    controlledValue ?? defaultValue,
  );
  const [direction, setDirection] = React.useState<1 | -1 | 0>(0);

  // Ordered registry of tab values — populated by TabsTrigger via registerTab.
  const tabOrderRef = React.useRef<string[]>([]);

  const registerTab = React.useCallback((value: string) => {
    if (!tabOrderRef.current.includes(value)) {
      tabOrderRef.current = [...tabOrderRef.current, value];
    }
  }, []);

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setActiveTab((prev) => {
        if (prev === undefined) {
          setDirection(0);
          return newValue;
        }
        const order = tabOrderRef.current;
        const prevIndex = order.indexOf(prev);
        const nextIndex = order.indexOf(newValue);
        setDirection(nextIndex > prevIndex ? 1 : -1);
        return newValue;
      });
      onValueChange?.(newValue);
    },
    [onValueChange],
  );

  React.useEffect(() => {
    if (controlledValue !== undefined) setActiveTab(controlledValue);
    else if (defaultValue !== undefined) setActiveTab(defaultValue);
  }, [controlledValue, defaultValue]);

  return (
    <TabsContext.Provider value={{ activeTab, direction, registerTab }}>
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

const INDICATOR_TRANSITION = { type: "spring", duration: 0.5 } as const;

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
    const { registerTab } = useTabsContext();

    // Register this tab's value into the ordered list on mount.
    React.useEffect(() => {
      registerTab(value);
    }, [value, registerTab]);

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
              aria-hidden="true"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>

        <span
          className="absolute inset-0 flex flex-row items-center gap-2 justify-center"
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
 * How far (in px) the entering/exiting panel travels horizontally.
 * Tweak this to taste — smaller values feel subtler, larger feel more dramatic.
 */
const CONTENT_OFFSET = 24;

const CONTENT_TRANSITION = {
  type: "spring",
  duration: 0.4,
  bounce: 0.15,
} as const;

const EXIT_TRANSITION = { ...CONTENT_TRANSITION, duration: 0.25 } as const;

const contentVariants: Variants = {
  enter: (d: 1 | -1 | 0) => ({
    x: d * CONTENT_OFFSET,
    opacity: 0,
  }),
  active: {
    x: 0,
    opacity: 1,
    transition: CONTENT_TRANSITION,
  },
  exit: (d: 1 | -1 | 0) => ({
    x: d * -CONTENT_OFFSET,
    opacity: 0,
    transition: EXIT_TRANSITION,
  }),
};

/**
 * TabsContent
 *
 * Each panel slides in from the direction of travel and fades out when leaving,
 * mirroring the trigger indicator animation.
 *
 * `forceMount` keeps all panels in the DOM permanently so AnimatePresence can
 * play exit animations. The tradeoff is that every panel re-renders when the
 * parent re-renders, not just the active one.
 *
 * To prevent inactive panels from re-rendering unnecessarily, wrap the
 * components you pass as children in `React.memo`:
 *
 *   export const MyTabPanel = React.memo(({ lead }: Props) => { ... });
 *
 * You don't need `React.memo` if your tab content is cheap to render, or if
 * the parent rarely re-renders. Add it when panels do expensive work on render
 * (data transforms, large lists, heavy computations).
 *
 * If you want to drop the exit animation and restore Radix's default unmount
 * behaviour, remove `forceMount`, `hidden`, and the `AnimatePresence` wrapper —
 * the enter animation will still work.
 */

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, value, children, ...props }, ref) => {
  const { activeTab, direction } = useTabsContext();
  const isActive = activeTab === value;

  return (
    // forceMount keeps the panel in the DOM so AnimatePresence can animate it out.
    <TabsPrimitive.Content
      ref={ref}
      value={value}
      forceMount
      // Hide the panel from AT and layout when not active and fully exited.
      // The motion.div handles the visible transition; this ensures the
      // inactive panel doesn't occupy space or receive focus.
      hidden={!isActive}
      className={cn(
        "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Remove `hidden` attribute's display:none so AnimatePresence can control visibility.
        "data-[state=inactive]:block",
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        {isActive && (
          <motion.div
            key={value}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="active"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ==========================================================================
// Exports
// ==========================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsContextValue, TabsTriggerExtendedProps };
