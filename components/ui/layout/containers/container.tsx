import React from "react";
import { cn } from "@/lib/utils/classnames";
import { type ContainerVariantProps } from "@/design-system/types/cva-types";
import { containerVariants } from "@/design-system/cva-variants/container-variants";

interface ContainerPropsBase extends ContainerVariantProps {
  children: React.ReactNode;
  className?: string;
}

export type ContainerProps<T extends keyof JSX.IntrinsicElements = "div"> =
  ContainerPropsBase &
    React.ComponentPropsWithoutRef<T> & {
      as?: T;
    };

export const Container = React.forwardRef<any, ContainerProps<any>>(
  (
    {
      children,
      className,
      spacing = "section",
      width,
      position,
      as: Component = "div",
      ...props
    },
    ref,
  ) => {
    /**
     * Container defaults are derived from `spacing`.
     *
     * `section` spacing suggests a constrained, centered layout by default,
     * but explicit `width` or `position` props always override.
     *
     * Other spacing values defer entirely to CVA defaults.
     */

    const resolvedWidth =
      spacing === "section" ? (width ?? "constrained") : width;

    const resolvedPosition =
      spacing === "section" ? (position ?? "center") : position;

    const variants = {
      spacing: spacing,
      width: resolvedWidth,
      position: resolvedPosition,
    };
    if (spacing === "section") {
      return (
        <Component ref={ref} className="@container" {...props}>
          <div className={cn(containerVariants(variants), className)}>
            {children}
          </div>
        </Component>
      );
    }

    return (
      <Component
        ref={ref}
        className={cn(containerVariants(variants), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";
