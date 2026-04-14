/**
 * Auth Types - Central export
 * Note: next-auth.d.ts is a module declaration file and doesn't need to be exported
 */

// Token types mapped to Prisma models for type safety
export type TokenType = "invite" | "passwordReset" | "emailVerification";

// Token validation failure reasons
export type TokenReason = "not_found" | "expired";
