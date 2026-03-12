import "server-only";
import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Helpers ────────────────────────────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret)
    throw new Error("ADMIN_PASSWORD is not set in environment variables");
  return secret;
}

async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(payload),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verify(
  payload: string,
  sig: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const sigBytes = new Uint8Array(
    sig.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
  );
  return crypto.subtle.verify(
    "HMAC",
    cryptoKey,
    sigBytes,
    encoder.encode(payload),
  );
}

async function createToken(secret: string): Promise<string> {
  const expires = Date.now() + COOKIE_MAX_AGE * 1000;
  const payload = `authenticated:${expires}`;
  const sig = await sign(payload, secret);
  return `${payload}:${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(":");
  if (parts.length !== 3) return false;

  const [status, expires, sig] = parts;

  if (status !== "authenticated") return false;
  if (Date.now() > parseInt(expires, 10)) return false;

  const payload = `${status}:${expires}`;
  return verify(payload, sig, secret);
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is not set in environment variables");
    return false;
  }
  return password === adminPassword;
}

export async function setAuthCookie(): Promise<void> {
  const secret = getSecret();
  const token = await createToken(secret);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function checkAuth(): Promise<boolean> {
  const secret = getSecret();
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token, secret);
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAuthFromRequest(request: Request): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const authCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!authCookie) return false;

  let token = authCookie.slice(`${AUTH_COOKIE_NAME}=`.length);
  token = decodeURIComponent(token);
  return verifyToken(token, secret);
}
