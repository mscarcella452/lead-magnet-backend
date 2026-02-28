"use client";

import { Link, ControlLabel } from "@/components/ui/controls";
import { usePathname, useRouter } from "next/navigation";
import { Button, ThemeToggleButton } from "@/components/ui/controls";
import { LayoutDashboard, LogOut } from "lucide-react";
import { clearAuthCookie } from "@/lib/auth";
import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils/classnames";
import { LogoAvatar } from "@/components/brand/logo-avatar";

/**
 * Admin Navigation Component (Client Component)
 *
 * Navigation bar for admin panel.
 */
export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/admin/logout", { method: "POST" });

      // Redirect to login
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="border-b border-muted bg-card-blur sticky top-0 z-50 px-4 lg:px-8">
      <div className="mx-auto flex h-16 items-center justify-between">
        <Container
          spacing="group"
          position="start"
          width="fit"
          className="flex flex-row items-center"
        >
          <Link
            href="/admin/dashboard"
            intent="text"
            mode="responsiveIcon"
            size="sm"
          >
            <LogoAvatar size="sm" />
            <ControlLabel>Lead Magnet Admin</ControlLabel>
          </Link>

          <Link
            href="/admin/dashboard"
            intent="text"
            size="sm"
            className={cn({
              "text-primary": pathname === "/admin/dashboard",
              "text-muted-foreground": pathname !== "/admin/dashboard",
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
          <LogOutButton handleLogout={handleLogout} />
          <ThemeToggleButton size="sm" intent="ghost" />
        </Container>
      </div>
    </nav>
  );
}

const LogOutButton = ({ handleLogout }: { handleLogout: () => void }) => {
  return (
    <>
      <Button
        intent="outline"
        size="sm"
        className="max-sm:hidden"
        onClick={handleLogout}
      >
        <LogOut />
        Logout
      </Button>
      <Button
        intent="outline"
        size="sm"
        mode="iconOnly"
        className="sm:hidden"
        onClick={handleLogout}
      >
        <LogOut />
      </Button>
    </>
  );
};
