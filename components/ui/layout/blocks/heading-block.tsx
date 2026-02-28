import { cn } from "@/lib/utils/classnames";
import { Badge } from "@/components/ui/feedback/badge";
import {
  Container,
  type ContainerProps,
} from "@/components/ui/layout/containers/container";
import { BadgeVariantProps } from "@/design-system/lib/types/cva-types";

export interface HeadingBlockProps {
  badge?: string;
  heading: string;
  description?: string;
  position?: ContainerProps["position"];
  badgeProps?: BadgeVariantProps;
  className?: string;
  children?: React.ReactNode;
}

export const HeadingBlock = ({
  badge,
  heading,
  description,
  position = "center",
  badgeProps,
  className,
  children,
}: HeadingBlockProps) => {
  return (
    <Container
      as="div"
      spacing="block"
      width="full"
      position={position}
      className={cn(
        "max-w-2xl flex flex-col text-balance",
        {
          "text-start @lg:text-center @lg:items-center": position === "center",
          "text-start": position === "start",
          "text-start @lg:text-end": position === "end",
          // 'border-l-8 border-muted pl-6': decoration && position === 'start',
        },
        className,
      )}
    >
      {badge && (
        <Badge
          variant={badgeProps?.variant || "tertiary"}
          shape={badgeProps?.shape || "default"}
          size={badgeProps?.size || "lg"}
        >
          {badge}
        </Badge>
      )}
      <Container spacing="group" position={position} as="div">
        <h2 className="text-4xl @lg:text-5xl font-medium @3xl:text-6xl leading-tight @3xl:leading-[1.05] font-display">
          {heading}
        </h2>
        {description && (
          <p className="text-foreground leading-relaxed @3xl:text-lg">
            {description}
          </p>
        )}
      </Container>
      {children}
    </Container>
  );
};
