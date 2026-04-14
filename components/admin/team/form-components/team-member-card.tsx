import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardProps,
  CardFooter,
} from "@/components/ui/layout/card";
import { Container, ContainerProps } from "@/components/ui/layout/containers";
import { motion } from "motion/react";
import React from "react";
import { Button, ButtonProps } from "@/components/ui/controls/button";

// ============================================================
// Types
// ============================================================

type SlideDirection = "forward" | "backward";

interface TeamMemberCardProps extends Omit<
  CardProps,
  "content" | "footer" | "children"
> {
  title: string;
  description: string;
  direction?: SlideDirection;
  spacing?: ContainerProps["spacing"];
  content: React.ReactNode;
  footer: React.ReactNode;
}

interface TeamMemberCardFooterProps {
  primaryProps: { label: string } & ButtonProps;
  secondaryProps: { label: string } & ButtonProps;
}

// ============================================================
// Helpers
// ============================================================

const getX = (direction: SlideDirection) =>
  direction === "forward" ? -10 : 10;

// ============================================================
// TeamMemberCard
// ============================================================

export const TeamMemberCard = React.forwardRef<
  HTMLDivElement,
  TeamMemberCardProps
>(
  (
    {
      title,
      description,
      direction = "forward",
      spacing = "content",
      content,
      footer,
      ...props
    },
    ref,
  ) => {
    const x = getX(direction);
    return (
      <motion.div
        layout
        ref={ref}
        initial={{ opacity: 0, x }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x }}
        transition={{ duration: 0.15 }}
      >
        <Card variant="none" size="none" {...props}>
          <Container spacing={spacing}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{content}</CardContent>
            <CardFooter>
              <Container
                spacing="group"
                position="end"
                width="fit"
                className="flex flex-row"
              >
                {footer}
              </Container>
            </CardFooter>
          </Container>
        </Card>
      </motion.div>
    );
  },
);

TeamMemberCard.displayName = "TeamMemberCard";

// ============================================================
// TeamMemberCardFooter
// ============================================================

export const TeamMemberCardFooter = ({
  primaryProps,
  secondaryProps,
}: TeamMemberCardFooterProps) => {
  const { label: primaryLabel, ...primaryRest } = primaryProps;
  const { label: secondaryLabel, ...secondaryRest } = secondaryProps;
  return (
    <>
      <Button type="button" intent="soft" size="sm" {...secondaryRest}>
        {secondaryLabel}
      </Button>
      <Button size="sm" {...primaryRest}>
        {primaryLabel}
      </Button>
    </>
  );
};
