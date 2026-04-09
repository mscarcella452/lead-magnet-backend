"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils/classnames";
import { AvatarVariantProps } from "@/design-system/types/cva-types";
import { avatarVariants } from "@/design-system/cva-variants/avatar-variants";
import NextImage from "next/image";

export interface AvatarProps
  extends
    AvatarVariantProps,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, radius, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden",
      avatarVariants({ size, radius }),
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// const AvatarImage = React.forwardRef<
//   React.ElementRef<typeof AvatarPrimitive.Image>,
//   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
// >(({ className, ...props }, ref) => (
//   <AvatarPrimitive.Image
//     ref={ref}
//     className={cn("aspect-square h-full w-full", className)}
//     {...props}
//   />
// ));

interface AvatarImageProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
  "src" | "alt" | "width" | "height"
> {
  src: string;
  alt: string;
  priority?: boolean;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, priority = false, src, alt, ...props }, ref) => {
  if (!src) return null;

  return (
    <NextImage
      fill
      priority={priority}
      src={src}
      alt={alt}
      sizes="64px"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
