/**
 * Security Layer
 *
 * Handles CORS validation and API key authentication for external API routes.
 * These functions protect public endpoints from unauthorized cross-origin requests.
 *
 * Environment variables:
 * - CLIENT_ALLOWED_ORIGIN: Comma-separated list of allowed origins (e.g. "https://mysite.com,https://www.mysite.com")
 * - CLIENT_API_KEY: Secret key that external clients must send in the x-api-key header
 */

// =============================================================================
// Allowed Origins
// =============================================================================

/**
 * Reads CLIENT_ALLOWED_ORIGIN from the environment and returns it as an array.
 *
 * Example:
 * CLIENT_ALLOWED_ORIGIN=https://mysite.com,https://promo.mysite.com
 * → ["https://mysite.com", "https://promo.mysite.com"]
 *
 * Returns an empty array if the variable is not set (development fallback).
 */
export const getAllowedOrigins = (): string[] => {
  const origins = process.env.CLIENT_ALLOWED_ORIGIN || "";
  return origins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
};

// =============================================================================
// Security Error
// =============================================================================

/**
 * Custom error class for security-related rejections.
 * Carries an HTTP status code so the route can return the correct response.
 *
 * 401 - missing or invalid credentials
 * 403 - origin not permitted
 */
export class SecurityError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403,
  ) {
    super(message);
    this.name = "SecurityError";
  }
}

// =============================================================================
// Origin Validation
// =============================================================================

/**
 * Validates that the request origin is in the allowed origins list.
 *
 * - If CLIENT_ALLOWED_ORIGIN is not configured, all origins are allowed (dev mode).
 * - Requests with no origin header are allowed through (server-to-server calls,
 *   Postman, curl — these don't send an origin).
 * - Browser requests from an unlisted origin are rejected with a 403.
 *
 * @throws SecurityError if the origin is present but not in the allowed list
 */
export function validateOrigin(request: Request): void {
  const allowedOrigins = getAllowedOrigins();

  if (allowedOrigins.length === 0) {
    console.warn(
      "⚠️  No CLIENT_ALLOWED_ORIGIN configured - allowing all origins",
    );
    return;
  }

  const origin = request.headers.get("origin");

  if (!origin) return;

  if (!allowedOrigins.includes(origin)) {
    throw new SecurityError(`Origin ${origin} not allowed`, 403);
  }
}

// =============================================================================
// API Key Validation
// =============================================================================

/**
 * Validates the API key sent in the x-api-key request header.
 *
 * External clients (your lead magnet forms) must include this header:
 * x-api-key: your-secret-key
 *
 * - If CLIENT_API_KEY is not configured, validation is skipped (dev mode).
 * - Missing or incorrect keys are rejected with a 401.
 *
 * @throws SecurityError if the API key is missing or doesn't match
 */
export function validateApiKey(request: Request): void {
  const apiKey = process.env.CLIENT_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️  No CLIENT_API_KEY configured - skipping API key validation",
    );
    return;
  }

  const requestApiKey = request.headers.get("x-api-key");

  if (!requestApiKey) {
    throw new SecurityError("API key missing", 401);
  }

  if (requestApiKey !== apiKey) {
    throw new SecurityError("Invalid API key", 401);
  }
}

// =============================================================================
// CORS Headers
// =============================================================================

/**
 * Builds the CORS headers to include in every API response.
 *
 * Tells the browser which origins, methods, and headers are permitted.
 * The Access-Control-Allow-Origin is set to the requesting origin if it's
 * in the allowed list — or falls back to the first allowed origin.
 *
 * Access-Control-Max-Age caches the preflight response for 24 hours (86400s)
 * so browsers don't send an OPTIONS request before every POST.
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "*";
  const allowedOrigins = getAllowedOrigins();

  const allowOrigin =
    allowedOrigins.length > 0 && allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0] || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    "Access-Control-Max-Age": "86400",
  };
}
