"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/layout/dropdown-menu";
import { Shield, User, LogOut } from "lucide-react";
import { APP_ROUTES } from "@/lib/server/constants";
import Link from "next/link";
import { UserAvatar } from "@/components/avatars/user-avatar";
import { Container } from "@/components/ui/layout/containers";
import { CurrentUser } from "@/lib/auth/auth-server-actions";
import { handleLogout } from "@/lib/auth/auth-client-actions";
import { useRouter } from "next/navigation";

// ==============================================
// Types
// ==============================================

interface UserDropdownMenuProps {
  children: React.ReactNode;
  isAdmin: boolean;
  user: CurrentUser;
}

// ==============================================
// UserDropdownMenu
// ==============================================

export function UserDropdownMenu({
  children,
  isAdmin,
  user,
}: UserDropdownMenuProps) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 max-w-56!">
        <DropdownMenuLabel>
          <Container spacing="item" className=" flex flex-row items-center ">
            <UserAvatar
              // src={user.image}
              src={null}
              name={user.name}
              size="xs"
            />
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-xs font-medium truncate">
                {user.username}
              </span>
              <span className=" text-caption font-normal truncate">
                {user.email}
              </span>
            </div>
          </Container>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href={APP_ROUTES.ADMIN_TEAM}>
                <Shield aria-hidden="true" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={APP_ROUTES.ACCOUNT}>
              <User aria-hidden="true" />
              Account Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleLogout(router)}
            variant="destructive"
          >
            <LogOut aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
