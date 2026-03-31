"use client";

import { useEffect } from "react";
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
import * as Sentry from "@sentry/nextjs";

// ============================================================================
// Types
// ============================================================================

interface SectionErrorProps extends FallbackProps {
  errorMessage: {
    title: string;
    description?: string;
  };
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
  errorMessage,
  cardProps,
  buttonProps,
}: SectionErrorProps) {
  const { label, ...restButtonProps } = buttonProps ?? {};

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error);
    } else {
      console.error("[SectionError]", error);
    }
  }, [error]);

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
            {errorMessage.title}
          </CardTitle>
          {errorMessage.description && (
            <CardDescription className="text-sm text-subtle-foreground col-start-2">
              {errorMessage.description}
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
