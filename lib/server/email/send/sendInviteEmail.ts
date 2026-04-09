import "server-only";
import { render } from "@react-email/components";
import InviteEmail from "@/emails/invite-email";
import "@/styles/globals.css";
import { formatExpiry } from "@/lib/utils/dates";
import { resend, getAppUrl, getEmailFrom } from "../utils";
import { EMAIL_SUBJECTS } from "../constants";

/**
 * Send invite email with magic link for setting password
 */
export async function sendInviteEmail(
  to: string,
  name: string,
  token: string,
  expiresAt: Date,
): Promise<{ success: boolean; error?: string }> {
  const appUrl = getAppUrl();
  const magicLink = `${appUrl}/auth/complete-invite?token=${token}`;
  const expiryDuration = formatExpiry(expiresAt);

  try {
    console.log("Sending invite email to:", to, "from:", getEmailFrom());

    const emailHtml = await render(
      InviteEmail({ name, magicLink, expiryDuration }),
    );

    const response = await resend.emails.send({
      from: getEmailFrom(),
      to,
      subject: EMAIL_SUBJECTS.INVITE,
      html: emailHtml,
    });

    console.log("Email sent successfully:", response);
    return { success: true };
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
