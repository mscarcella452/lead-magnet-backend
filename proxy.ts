import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES, AUTH_ROUTES } from "@/lib/server/constants";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/api/auth",
  "/auth/complete-invite",
  "/auth/account-recovery",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/invalid-token",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if route is public
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) {
    // If authenticated user tries to access login page, redirect to dashboard
    const session = await auth();
    if (session && pathname === AUTH_ROUTES.LOGIN) {
      return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  const session = await auth();
  if (!session) {
    // Redirect to login, but only if not already there
    if (pathname !== AUTH_ROUTES.LOGIN) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
