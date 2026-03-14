"use client";

import { Link } from "@/components/ui/controls";
import { usePathname } from "next/navigation";
import { ThemeToggleButton, ControlLabel } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils/classnames";
import { LogoAvatar } from "@/components/brand/logo-avatar";
import { LogoutButton } from "@/components/auth/log-out-button";

/**
 * Admin Navigation Component (Client Component)
 *
 * Navigation bar for admin panel.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b surface-card-blur sticky top-0 z-50 px-4 lg:px-8">
      <div className="mx-auto flex h-16 items-center justify-between">
        <Container
          spacing="group"
          position="start"
          width="fit"
          className="flex flex-row items-center"
        >
          <Link href="/dashboard" intent="text" mode="responsiveIcon" size="sm">
            <LogoAvatar size="sm" />
            <ControlLabel>Lead Magnet Admin</ControlLabel>
          </Link>

          <Link
            href="/dashboard"
            intent="text"
            size="sm"
            className={cn({
              "text-primary": pathname === "/dashboard",
              "text-muted-foreground": pathname !== "/dashboard",
            })}
          >
            Dashboard
          </Link>
        </Container>

        <Container
          spacing="group"
          position="end"
          width="fit"
          className="flex flex-row items-center"
        >
          <LogoutButton />
          <ThemeToggleButton size="sm" intent="outline" />
        </Container>
      </div>
    </nav>
  );
}
