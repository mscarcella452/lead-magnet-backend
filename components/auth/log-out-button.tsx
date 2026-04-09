"use client";

import { Button, type ButtonProps } from "@/components/ui/controls";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/auth/auth-client-actions";
import { useRouter } from "next/navigation";

export function LogoutButton({ children, ...props }: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      onClick={() => handleLogout(router)}
      intent="outline"
      size="sm"
      {...props}
    >
      {children || (
        <>
          <LogOut aria-hidden="true" />
          Log out
        </>
      )}
    </Button>
  );
}
