"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button, ButtonProps } from "@/components/ui/controls";
import { cn } from "@/lib/utils/classnames";
import { useDialogContext } from "./dialog-context";
import { X } from "lucide-react";
import { Container, ContainerProps } from "@/components/ui/layout/containers";

// ============================================================================
// DialogClose - Close button with context integration
// ============================================================================

const DialogClose = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ onClick, ...props }, ref) => {
  const { handleClose } = useDialogContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleClose?.();
    onClick?.(e);
  };

  const { children = <X />, className, ...restProps } = props;

  return (
    <DialogPrimitive.Close asChild aria-label="Close dialog">
      <Button
        ref={ref}
        onClick={handleClick}
        intent="ghost"
        size="sm"
        radius="pill"
        mode="iconOnly"
        className={cn("absolute top-2 right-2 z-40", className)}
        {...restProps}
      >
        {children}
      </Button>
    </DialogPrimitive.Close>
  );
});
DialogClose.displayName = "DialogClose";

// ============================================================================
// DialogHeader - Header section with title and description
// ============================================================================

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

// ============================================================================
// DialogBody - Main content area
// ============================================================================

const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
DialogBody.displayName = "DialogBody";

// ============================================================================
// DialogFooter - Footer section for actions and metadata
// ============================================================================

interface DialogFooterProps extends Omit<ContainerProps, "className"> {
  className?: string;
  layout?: "default" | "responsive" | "custom";
}

const DialogFooter = ({
  className,
  layout = "responsive",
  ...props
}: DialogFooterProps) => (
  <Container
    spacing="group"
    className={cn(
      "text-sm text-muted-foreground",
      {
        "flex flex-row justify-end items-center": layout === "default",
      },
      {
        "flex flex-col-reverse @md:flex-row @md:justify-end @md:items-center ":
          layout === "responsive",
      },
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// ============================================================================
// DialogTitle - Accessible title element
// ============================================================================

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// ============================================================================
// DialogDescription - Accessible description element
// ============================================================================

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// ============================================================================
// Exports
// ============================================================================

export {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
