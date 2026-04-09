"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { AUTH_ROUTES } from "@/lib/server/constants";

export async function handleLogout(router: { replace: (url: string) => void }) {
  try {
    await signOut({ redirect: false });
    router.replace(AUTH_ROUTES.LOGIN);
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Failed to log out");
  }
}
