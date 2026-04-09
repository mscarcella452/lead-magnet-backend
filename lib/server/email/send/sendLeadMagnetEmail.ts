import "server-only";
import { render } from "@react-email/components";
import LeadMagnetEmail from "@/emails/lead-magnet-email";
import "@/styles/globals.css";
import { resend, getEmailFrom } from "../utils";
import { EMAIL_SUBJECTS } from "../constants";

/**
 * Send lead magnet email with PDF attachment
 */
export async function sendLeadMagnetEmail(
  email: string,
  pdfUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailHtml = await render(LeadMagnetEmail({ pdfUrl }));

    await resend.emails.send({
      from: getEmailFrom(),
      to: email,
      subject: EMAIL_SUBJECTS.LEAD_MAGNET,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send lead magnet email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
