import { z } from "zod";
import { LEAD_SOURCES } from "@/types/lead-constants";

// ============================================================================
// Lead submission schema
// Used to validate incoming lead data from external websites
// ============================================================================
export const leadSubmissionSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(3, "Email too short")
    .max(255, "Email too long"),
  name: z.string().min(1, "Name is required").max(255, "Name too long").trim(),
  source: z.enum(LEAD_SOURCES).optional(),
  metadata: z
    .record(z.string().max(500)) // Only string values, max 500 chars each
    .refine(
      (obj) => Object.keys(obj).length <= 20,
      "Metadata cannot have more than 20 key-value pairs",
    )
    .optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

// ============================================================================
// Admin login schema
// ============================================================================
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// ============================================================================
// Delete lead schema
// ============================================================================
export const deleteLeadSchema = z.object({
  id: z.string().min(1, "Lead ID is required"),
});

export type DeleteLeadInput = z.infer<typeof deleteLeadSchema>;

// ============================================================================
// sanitizeString(input: string): string
// Sanitizes a string to prevent XSS
// ============================================================================
export function sanitizeString(input: string): string {
  return input.replace(/[<>]/g, "").trim().slice(0, 500);
}

// Room to grow:
// export function isValidPhone(phone: string): boolean { ... }
// export function isValidURL(url: string): boolean { ... }
