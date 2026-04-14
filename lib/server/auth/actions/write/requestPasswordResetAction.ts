"use server";
import { requestPasswordReset } from "@/lib/server/auth/write/requestPasswordReset";
import type { FormState } from "@/lib/forms/useFormState";
import type { AuthFieldKey } from "@/lib/auth/auth-forms/types";
import { validateEmail } from "@/lib/auth/auth-forms/validation";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ==============================================
// Rate Limiting
// ==============================================

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 m"), // stricter than login
  analytics: true,
});

// ==============================================
// Action
// ==============================================

export async function requestPasswordResetAction(
  formData: FormData,
): Promise<FormState<AuthFieldKey>> {
  const email = (formData.get("email") as string)?.trim();

  // ==============================================
  // Validation
  // ==============================================

  const validationError = validateEmail(email);
  if (validationError) return validationError;

  // ==============================================
  // Rate Limiting
  // ==============================================

  const ip = (await headers()).get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await ratelimit.limit(`password-reset:${ip}`);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return {
      status: "error",
      error: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // ==============================================
  // Request Reset
  // ==============================================

  try {
    await requestPasswordReset({ email });
  } catch (e) {
    console.error("requestPasswordReset error:", e);
    return {
      status: "error",
      error: "Something went wrong. Please try again.",
    };
  }

  // ==============================================
  // Success
  // ==============================================

  return { status: "success" };
}
