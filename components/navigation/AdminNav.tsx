"use client";

import { Link } from "@/components/ui/controls";
import { usePathname } from "next/navigation";
import { ThemeToggleButton, ControlLabel } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils/classnames";
import { LogoAvatar } from "@/components/brand/logo-avatar";
import { LogoutButton } from "@/components/auth/log-out-button";
import { SITE_CONFIG } from "@/config";

/**
 * Admin Navigation Component (Client Component)
 *
 * Navigation bar for admin panel.
 */
export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
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
          {isAdmin ? (
            <>
              <Link
                href="/dashboard"
                intent="text"
                mode="responsiveIcon"
                size="sm"
              >
                <LogoAvatar size="sm" />
                <ControlLabel>{SITE_CONFIG.business_name} </ControlLabel>
              </Link>

              <Link href="/dashboard/admin/team" intent="text" size="sm">
                Admin
              </Link>
            </>
          ) : (
            <Container
              spacing="group"
              position="start"
              width="fit"
              className="flex flex-row items-center"
            >
              <LogoAvatar size="sm" />
              {SITE_CONFIG.business_name}
            </Container>
          )}
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
