"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { motion, AnimatePresence, animate } from "motion/react";

import { cn } from "@/lib/utils/classnames";

// ─── Context ────────────────────────────────────────────────────────────────

const DropdownMenuContext = React.createContext<{
  open: boolean;
}>({ open: false });

const useDropdownMenuContext = () => React.useContext(DropdownMenuContext);

// ─── Root ────────────────────────────────────────────────────────────────────

const DropdownMenu = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);

  const open = controlledOpen ?? internalOpen;

  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DropdownMenuContext.Provider value={{ open }}>
      <DropdownMenuPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </DropdownMenuContext.Provider>
  );
};
DropdownMenu.displayName = "DropdownMenu";

// ─── Motion Content ──────────────────────────────────────────────────────────

const MotionContent = motion.create(DropdownMenuPrimitive.Content);

// ─── Primitives (unchanged) ──────────────────────────────────────────────────

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// ─── Sub Trigger ─────────────────────────────────────────────────────────────

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

// ─── Sub Content ─────────────────────────────────────────────────────────────

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

// ─── Content ─────────────────────────────────────────────────────────────────

const sideVariants = {
  top: {
    initial: { opacity: 0, scale: 0.75, y: 20 },
    exit: { opacity: 0, scale: 0.75, y: 20 },
  },
  bottom: {
    initial: { opacity: 0, scale: 0.75, y: -20 },
    exit: { opacity: 0, scale: 0.75, y: -20 },
  },
  left: {
    initial: { opacity: 0, scale: 0.75, x: 20 },
    exit: { opacity: 0, scale: 0.75, x: 20 },
  },
  right: {
    initial: { opacity: 0, scale: 0.75, x: -20 },
    exit: { opacity: 0, scale: 0.75, x: -20 },
  },
} satisfies Record<string, { initial: object; exit: object }>;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const { open } = useDropdownMenuContext();

  const { initial, exit } = sideVariants[props.side || "bottom"];

  return (
    <AnimatePresence mode="wait">
      {open && (
        <DropdownMenuPrimitive.Portal forceMount>
          <DropdownMenuPrimitive.Content
            ref={ref}
            forceMount
            sideOffset={sideOffset}
            asChild
            className={cn(
              "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 overflow-y-auto overflow-x-hidden border p-[.2rem] text-popover-foreground shadow-md origin-[--radix-dropdown-menu-content-transform-origin]",
              "bg-card rounded-lg space-y-[.2rem]",
              className,
            )}
            {...props}
          >
            <motion.div
              initial={initial}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={exit}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {props.children}
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// ─── Group ───────────────────────────────────────────────────────────────────

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={cn(
      "bg-popover overflow-hidden rounded-md p-[.125rem]",
      className,
    )}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

// ─── Item ─────────────────────────────────────────────────────────────────────

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive" | "brand";
  }
>(({ className, inset, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[1em] [&_svg]:text-muted-foreground  [&_svg]:shrink-0",
      inset && "pl-8",
      {
        "[&_svg]:text-destructive-text text-destructive-text hover:text-destructive-text!":
          variant === "destructive",
      },
      {
        "[&_svg]:text-brand-text text-brand-text hover:text-brand-text!":
          variant === "brand",
      },
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// ─── Checkbox Item ────────────────────────────────────────────────────────────

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

// ─── Radio Item ───────────────────────────────────────────────────────────────

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// ─── Label ────────────────────────────────────────────────────────────────────

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// ─── Separator ────────────────────────────────────────────────────────────────

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border/75", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// ─── Shortcut ─────────────────────────────────────────────────────────────────

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
