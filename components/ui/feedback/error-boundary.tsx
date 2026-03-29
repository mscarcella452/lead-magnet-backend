"use client";

import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackRender: (props: FallbackProps) => React.ReactNode;
}

export function ErrorBoundary({
  children,
  fallbackRender,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      {children}
    </ReactErrorBoundary>
  );
}
