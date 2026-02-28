import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/index";
import {
  Button,
  ButtonProps,
  ControlLabel,
} from "@/components/ui/controls/button";
import { Link, LinkProps } from "@/components/ui/controls/link";

// ============================================================================
// Container Components
// ============================================================================

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={className} {...props} />
));
PaginationItem.displayName = "PaginationItem";

// ============================================================================
// Page Number Components
// Use PaginationButton for client-side pagination with onClick handlers
// Use PaginationLink for server-side pagination with URL navigation
// ============================================================================

interface PaginationButtonProps extends ButtonProps {
  isActive?: boolean;
}

const PaginationButton = ({ isActive, ...props }: PaginationButtonProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    intent={isActive ? "outline" : "ghost"}
    size="sm"
    mode="iconOnly"
    {...props}
  />
);
PaginationButton.displayName = "PaginationButton";

interface PaginationLinkProps extends LinkProps {
  isActive?: boolean;
}

const PaginationLink = ({ isActive, ...props }: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    intent={isActive ? "outline" : "ghost"}
    size="sm"
    mode="iconOnly"
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

// ============================================================================
// Shared Label Components
// ============================================================================

const PreviousLabel = () => (
  <>
    <ChevronLeft />
    <ControlLabel>Previous</ControlLabel>
  </>
);

const NextLabel = () => (
  <>
    <ControlLabel>Next</ControlLabel>
    <ChevronRight />
  </>
);

// ============================================================================
// Navigation Components - Client-side (buttons)
// ============================================================================

const PaginationPreviousButton = ({ ...props }: PaginationButtonProps) => (
  <PaginationButton
    aria-label="Go to previous page"
    size="sm"
    intent="ghost"
    mode="responsiveIcon"
    {...props}
  >
    <PreviousLabel />
  </PaginationButton>
);
PaginationPreviousButton.displayName = "PaginationPreviousButton";

const PaginationNextButton = ({ ...props }: PaginationButtonProps) => (
  <PaginationButton
    aria-label="Go to next page"
    size="sm"
    intent="ghost"
    mode="responsiveIcon"
    {...props}
  >
    <NextLabel />
  </PaginationButton>
);
PaginationNextButton.displayName = "PaginationNextButton";

// ============================================================================
// Navigation Components - Server-side (links)
// ============================================================================

const PaginationPreviousLink = ({ ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="sm"
    intent="ghost"
    mode="responsiveIcon"
    radius="md"
    {...props}
  >
    <PreviousLabel />
  </PaginationLink>
);
PaginationPreviousLink.displayName = "PaginationPreviousLink";

const PaginationNextLink = ({ ...props }: PaginationLinkProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="sm"
    intent="ghost"
    mode="responsiveIcon"
    radius="md"
    {...props}
  >
    <NextLabel />
  </PaginationLink>
);
PaginationNextLink.displayName = "PaginationNextLink";

// ============================================================================
// Utility Components
// ============================================================================

interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
  iconClassName?: string;
}

const PaginationEllipsis = ({
  className,
  iconClassName,
  ...props
}: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className={cn("size-4", iconClassName)} />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

// ============================================================================
// Exports
// ============================================================================

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationLink,
  PaginationPreviousButton,
  PaginationNextButton,
  PaginationEllipsis,
  PaginationPreviousLink,
  PaginationNextLink,
};

export type {
  PaginationButtonProps,
  PaginationLinkProps,
  PaginationEllipsisProps,
};
