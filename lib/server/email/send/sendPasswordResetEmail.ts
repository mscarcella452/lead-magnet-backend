import "server-only";
import { render } from "@react-email/components";
import PasswordResetEmail from "@/emails/password-reset-email";
import "@/styles/globals.css";
import { formatExpiry } from "@/lib/utils/dates";
import { resend, getAppUrl, getEmailFrom } from "../utils";
import { EMAIL_SUBJECTS } from "../constants";
import { buildResetPasswordUrl } from "@/lib/server/auth/helpers";

/**
 * Send password reset email with reset link
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  username: string,
  token: string,
  expiresAt: Date,
): Promise<{ success: boolean; error?: string }> {
  const appUrl = getAppUrl();
  const resetLink = `${appUrl}${buildResetPasswordUrl(token)}`;
  const expiryDuration = formatExpiry(expiresAt);

  try {
    console.log(
      "Sending password reset email to:",
      to,
      "from:",
      getEmailFrom(),
    );

    const emailHtml = await render(
      PasswordResetEmail({ name, username, resetLink, expiryDuration }),
    );

    const response = await resend.emails.send({
      from: getEmailFrom(),
      to,
      subject: EMAIL_SUBJECTS.PASSWORD_RESET,
      html: emailHtml,
    });

    console.log("Password reset email sent successfully:", response);
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
