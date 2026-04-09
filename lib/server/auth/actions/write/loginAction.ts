// ==============================================
// lib/server/actions/write/loginAction.ts
// ==============================================

"use server";
import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import {
  ERROR_MESSAGES as err,
  type AuthErrorCode,
} from "@/lib/auth/auth-errors";
import { type FormState } from "@/components/auth/lib/types";
import { validateLogin } from "@/components/auth/lib/utils";

// ==============================================
// Rate Limiting
// ==============================================

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"), //   5 attempts per minute
  analytics: true,
});

// ==============================================
// Action
// ==============================================

export async function loginAction(
  redirectTo: string,
  formData: FormData,
): Promise<FormState> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  // -----------------------------------------------
  // Validation
  // -----------------------------------------------

  const validationError = validateLogin({ username, password });
  if (validationError) return validationError;

  // -----------------------------------------------
  // Rate Limiting
  // -----------------------------------------------

  const ip = (await headers()).get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await ratelimit.limit(`login:${ip}`);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return {
      status: "error",
      error: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // -----------------------------------------------
  // Auth
  // -----------------------------------------------

  try {
    await signIn("credentials", { username, password, redirectTo });
  } catch (e) {
    if (isRedirectError(e)) throw e;

    if (e instanceof CredentialsSignin) {
      const code = (e.code as AuthErrorCode) ?? "default";
      return {
        status: "error",
        error: err[code] ?? err.default,
        field:
          code === "user_not_found"
            ? "username"
            : code === "invalid_credentials"
              ? "password"
              : undefined,
      };
    }

    return { status: "error", error: err.default };
  }

  return { status: "success" };
}
