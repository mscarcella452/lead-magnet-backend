"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * BfcacheGuard
 *
 * Prevents authenticated pages from being accessible after logout
 * via the browser's back/forward cache (bfcache).
 *
 * When a user logs out and hits the back button, the browser may restore
 * a cached version of the page without hitting the server — bypassing
 * the auth check in the layout entirely.
 *
 * This component listens for bfcache restores (e.persisted === true) and
 * forces a server re-fetch via router.refresh(), which re-runs the layout's
 * auth check and redirects unauthenticated users to login.
 *
 * Used in: app/dashboard/layout.tsx
 */

export function BfcacheGuard() {
  const router = useRouter();

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        router.refresh();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  return null;
}
