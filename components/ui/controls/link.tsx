import * as React from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { ControlVariantProps } from "@/design-system/lib/types/cva-types";
import { Button } from "@/components/ui/controls/button";
import { validateResponsiveIcon } from "@/design-system/lib/helpers/validation";

// ============================================================================
// Link Props
// ============================================================================

interface LinkProps
  extends
    NextLinkProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    ControlVariantProps {
  /** Opens link in a new tab with appropriate security attributes */
  isExternalLink?: boolean;
  /** Screen reader text for external links (default: "opens in a new tab") */
  externalText?: string;
  /** URL destination - explicitly required to override NextLinkProps optional href */
  href: string;
}

// ============================================================================
// Link Component
// ============================================================================
// Wrapper around Next.js Link that applies Button styling variants.
// Uses Button's asChild pattern to compose link behavior with button appearance.

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      intent,
      size,
      radius,
      mode,
      href,
      children,
      isExternalLink = false,
      externalText = "opens in a new tab",
      ...props
    },
    ref,
  ) => {
    // ========================================================================
    // Development Validation
    // ========================================================================
    // Validate that responsiveIcon mode has the required ControlLabel child

    if (process.env.NODE_ENV === "development" && mode === "responsiveIcon") {
      const error = validateResponsiveIcon(children);
      if (error) console.warn(`Link: ${error}`);
    }

    // ========================================================================
    // Render
    // ========================================================================
    // Button with asChild passes styling to NextLink
    // External links get target="_blank" and security attributes

    return (
      <Button
        asChild
        variant={variant}
        intent={intent}
        size={size}
        radius={radius}
        mode={mode}
        className={className}
      >
        <NextLink
          ref={ref}
          href={href}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
          {isExternalLink && <span className="sr-only"> ({externalText})</span>}
        </NextLink>
      </Button>
    );
  },
);

Link.displayName = "Link";

// ============================================================================
// Exports
// ============================================================================

export { Link, type LinkProps };
