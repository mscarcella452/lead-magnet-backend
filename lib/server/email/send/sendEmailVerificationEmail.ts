import "server-only";
import { render } from "@react-email/components";
import EmailVerification from "@/emails/email-verification";
import "@/styles/globals.css";
import { resend, getAppUrl, getEmailFrom } from "../utils";
import { EMAIL_SUBJECTS } from "../constants";
import { formatExpiry } from "@/lib/utils/dates";

/**
 * Send email verification email with verification link
 */
export async function sendEmailVerificationEmail(
  to: string,
  name: string,
  newEmail: string,
  token: string,
  expiresAt: Date,
): Promise<{ success: boolean; error?: string }> {
  const appUrl = getAppUrl();
  const verificationLink = `${appUrl}/auth/verify-email?token=${token}`;
  const expiryDuration = formatExpiry(expiresAt);

  try {
    console.log("Sending email verification to:", to, "from:", getEmailFrom());

    const emailHtml = await render(
      EmailVerification({ name, newEmail, verificationLink, expiryDuration }),
    );

    const response = await resend.emails.send({
      from: getEmailFrom(),
      to,
      subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
      html: emailHtml,
    });

    console.log("Email verification sent successfully:", response);
    return { success: true };
  } catch (error) {
    console.error("Failed to send email verification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
