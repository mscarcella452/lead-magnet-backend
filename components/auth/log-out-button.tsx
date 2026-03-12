"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, ButtonProps, ControlLabel } from "@/components/ui/controls";
import { LogOut, type LucideIcon } from "lucide-react";

interface LogOutButtonProps extends Omit<ButtonProps, "onClick"> {
  label?: string;
  hideLabel?: boolean;
  icon?: LucideIcon;
}

export function LogOutButton({
  label = "Logout",
  hideLabel = false,
  icon: Icon = LogOut,
  ...props
}: LogOutButtonProps) {
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
    <Button
      intent="outline"
      size="sm"
      mode="responsiveIcon"
      onClick={handleLogout}
      {...props}
    >
      <Icon />
      {!hideLabel && <ControlLabel>{label}</ControlLabel>}
    </Button>
  );
}
