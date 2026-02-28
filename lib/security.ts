/**
 * Security Layer
 * 
 * Handles CORS validation and API key authentication for external API routes.
 * These functions protect the public API endpoints from unauthorized access.
 */

/**
 * Allowed origins for CORS
 * Loaded from environment variable CLIENT_ALLOWED_ORIGIN
 * Format: "https://example.com,https://www.example.com"
 */
export const getAllowedOrigins = (): string[] => {
  const origins = process.env.CLIENT_ALLOWED_ORIGIN || '';
  return origins.split(',').map(origin => origin.trim()).filter(Boolean);
};

/**
 * Validate request origin against allowed origins
 * @param request - Incoming request
 * @throws Error if origin is not allowed
 */
export function validateOrigin(request: Request): void {
  const allowedOrigins = getAllowedOrigins();
  
  // If no origins configured, allow all (development mode)
  if (allowedOrigins.length === 0) {
    console.warn('⚠️  No CLIENT_ALLOWED_ORIGIN configured - allowing all origins');
    return;
  }

  const origin = request.headers.get('origin');
  
  // Allow requests without origin (e.g., server-to-server, Postman)
  if (!origin) {
    return;
  }

  if (!allowedOrigins.includes(origin)) {
    throw new Error(`Origin ${origin} not allowed`);
  }
}

/**
 * Validate API key from request header
 * @param request - Incoming request
 * @throws Error if API key is invalid or missing
 */
export function validateApiKey(request: Request): void {
  const apiKey = process.env.CLIENT_API_KEY;
  
  // If no API key configured, skip validation (optional security)
  if (!apiKey) {
    console.warn('⚠️  No CLIENT_API_KEY configured - skipping API key validation');
    return;
  }

  const requestApiKey = request.headers.get('x-api-key');

  if (!requestApiKey) {
    throw new Error('API key missing');
  }

  if (requestApiKey !== apiKey) {
    throw new Error('Invalid API key');
  }
}

/**
 * Get CORS headers for API responses
 * @param request - Incoming request
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || '*';
  const allowedOrigins = getAllowedOrigins();
  
  // Only allow specific origin if it's in the allowed list
  const allowOrigin = allowedOrigins.length > 0 && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Security error class for consistent error handling
 */
export class SecurityError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message);
    this.name = 'SecurityError';
  }
}
