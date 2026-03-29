"use client";

import { FallbackProps } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardProps,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/layout/card";
import { Container } from "@/components/ui/layout/containers";
import { Button, ButtonProps } from "@/components/ui/controls";

// ============================================================================
// Types
// ============================================================================

interface SectionErrorProps extends FallbackProps {
  fallbackErrorMessage: string;
  description?: string;
  cardProps?: CardProps;
  buttonProps?: Omit<ButtonProps, "onClick"> & {
    label?: string;
  };
}

// ============================================================================
// SectionError
// ============================================================================

export function SectionError({
  error,
  resetErrorBoundary,
  fallbackErrorMessage,
  description,
  cardProps,
  buttonProps,
}: SectionErrorProps) {
  const { label, ...restButtonProps } = buttonProps ?? {};

  return (
    <Card
      size="lg"
      variant="panel"
      border={true}
      className="w-full"
      role="alert"
      aria-live="assertive"
      {...cardProps}
    >
      <Container
        spacing="group"
        className="flex flex-row items-center justify-between"
      >
        <CardHeader className=" text-base text-destructive-text grid grid-cols-[auto_1fr]">
          <AlertCircle aria-hidden="true" className="size-[1.25em] shrink-0" />
          <CardTitle className="flex items-center gap-2">
            {error instanceof Error ? error.message : fallbackErrorMessage}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-subtle-foreground col-start-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <Button
          size="sm"
          intent="outline"
          onClick={resetErrorBoundary}
          {...restButtonProps}
        >
          {label ?? "Try again"}
        </Button>
      </Container>
    </Card>
  );
}
