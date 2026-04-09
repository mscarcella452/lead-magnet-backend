"use client";

import { Link } from "@/components/ui/controls";
import { ThemeToggleButton, ControlLabel } from "@/components/ui/controls";
import { Container } from "@/components/ui/layout/containers";
import { LogoAvatar } from "@/components/avatars/logo-avatar";
import { SITE_CONFIG } from "@/config";
import { UserDropdownMenu } from "@/components/navigation/user-dropdown-menu";
import { CircleUserIcon } from "lucide-react";
import { Button } from "@/components/ui/controls";
import { CurrentUser } from "@/lib/auth/auth-server-actions";
import { APP_ROUTES } from "@/lib/server/constants";

/**
 * Admin Navigation Component (Client Component)
 *
 * Navigation bar for admin panel.
 */
export function AdminNav({
  isAdmin,
  user,
}: {
  isAdmin: boolean;
  user: CurrentUser;
}) {
  return (
    <nav className="border-b surface-card-blur sticky top-0 z-50 px-4 lg:px-8">
      <div className="mx-auto flex h-16 items-center justify-between">
        <Link href={APP_ROUTES.DASHBOARD} intent="text" size="sm">
          <LogoAvatar size="sm" />
          {SITE_CONFIG.business_name}
        </Link>

        <Container
          spacing="group"
          position="end"
          width="fit"
          className="flex flex-row items-center"
        >
          {/* <LogoutButton /> */}
          <UserDropdownMenu isAdmin={isAdmin} user={user}>
            <Button size="sm" intent="outline" mode="responsiveIcon">
              {/* <LogoAvatar size="none" className="rounded-full size-6!" /> */}
              <CircleUserIcon />
              <ControlLabel>{user.username}</ControlLabel>
            </Button>
          </UserDropdownMenu>
          <ThemeToggleButton size="sm" intent="outline" />
        </Container>
      </div>
    </nav>
  );
}
