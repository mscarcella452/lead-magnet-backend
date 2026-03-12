"use client";

import { Link, ControlLabel } from "@/components/ui/controls";
import { usePathname, useRouter } from "next/navigation";
import { Button, ThemeToggleButton } from "@/components/ui/controls";
import { LogOut } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils/classnames";
import { LogoAvatar } from "@/components/brand/logo-avatar";
import { toast } from "sonner";
import { LogOutButton } from "@/components/auth/log-out-button";

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
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

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
          <LogOutButton />
          <ThemeToggleButton size="sm" intent="outline" />
        </Container>
      </div>
    </nav>
  );
}
