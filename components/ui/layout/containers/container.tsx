import { cn } from "@/lib/utils/classnames";
import { ContainerVariantProps } from "@/design-system/lib/types/cva-types";
import { containerVariants } from "@/design-system/cva-variants/container-variants";

export interface ContainerProps extends ContainerVariantProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}
const Container = ({
  children,
  className,
  spacing = "section",
  width,
  position,
  as: Component = "div",
}: ContainerProps) => {
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
      <Component className="@container">
        <div className={cn(containerVariants(variants), className)}>
          {children}
        </div>
      </Component>
    );
  }

  return (
    <Component className={cn(containerVariants(variants), className)}>
      {children}
    </Component>
  );
};

export { Container };
