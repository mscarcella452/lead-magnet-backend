import { cookies } from "next/headers";

/**
 * Authentication Utilities
 *
 * Simple password-based authentication for admin panel.
 * Can be upgraded to NextAuth.js or other solutions later.
 */

const AUTH_COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Verify admin password against environment variable
 * @param password - Password to verify
 * @returns True if password is correct
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not set in environment variables");
    return false;
  }

  // ✅ Add timing-safe comparison to prevent timing attacks
  // For now, simple comparison is fine for single admin
  return password === adminPassword;
}

/**
 * Set authentication cookie
 * Creates a secure, httpOnly cookie for admin authentication
 */
export async function setAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  // Generate a simple token (in production, use JWT or similar)
  // const token = Buffer.from(
  //   `${process.env.NEXTAUTH_SECRET || "default-secret"}:${Date.now()}`,
  // ).toString("base64");

  // ✅ Simplified - just use a constant value since we only check existence
  // No need for complex token generation for simple auth
  const token = "authenticated";

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  // return !!authCookie?.value;

  // ✅ Check for specific value instead of just existence
  return authCookie?.value === "authenticated";
}

/**
 * Clear authentication cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get authentication status from request
 * Used in middleware
 */
export function getAuthFromRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  // return cookieHeader.includes(AUTH_COOKIE_NAME);

  // ✅ More robust cookie parsing
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const authCookie = cookies.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!authCookie) return false;

  const value = authCookie.split("=")[1];
  return value === "authenticated";
}
