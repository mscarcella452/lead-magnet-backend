import { z } from "zod";

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
  source: z
    .enum([
      "WEBSITE_HOMEPAGE",
      "WEBSITE_CONTACT",
      "WEBSITE_PRICING",
      "WEBSITE_BLOG",
      "WEBSITE_DEMO",
      "LANDING_PAGE_PROMO",
      "GOOGLE_ADS",
      "FACEBOOK_AD",
      "LINKEDIN_POST",
      "TWITTER_AD",
      "EMAIL_CAMPAIGN",
      "WEBINAR",
      "REFERRAL",
      "PARTNER_REFERRAL",
      "ORGANIC_SEARCH",
      "DIRECT",
    ])
    .optional(),
  metadata: z.record(z.any()).optional(),
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
