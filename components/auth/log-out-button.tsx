"use client";

import { signOut } from "next-auth/react";
import { Button, type ButtonProps } from "@/components/ui/controls";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export function LogoutButton({ children, ...props }: ButtonProps) {
  const handleLogout = async () => {
    try {
      await signOut({ redirectTo: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <Button onClick={handleLogout} intent="outline" size="sm" {...props}>
      {children || (
        <>
          <LogOut className="size-4" />
          Log out
        </>
      )}
    </Button>
  );
}
