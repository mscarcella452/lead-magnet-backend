import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send invite email with magic link for setting password
 */
export async function sendInviteEmail(
  to: string,
  name: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const magicLink = `${appUrl}/auth/complete-invite?token=${token}`;

  try {
    console.log(
      "Sending invite email to:",
      to,
      "from:",
      process.env.EMAIL_FROM,
    );
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to,
      subject: "Welcome! Set your password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You've been invited to join our lead dashboard. Click the button below to set your password and get started.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${magicLink}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Set Your Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
            Or copy this link: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${magicLink}</code>
          </p>
          
          <p style="color: #999; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            This link expires in 24 hours. If you didn't request this invite, please ignore this email.
          </p>
        </div>
      `,
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

/**
 * Send password reset email with reset code
 * TODO: Implement password reset flow
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

  try {
    console.log(
      "Sending password reset email to:",
      to,
      "from:",
      process.env.EMAIL_FROM,
    );

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset your password, ${name}</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
            Or copy this link: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px;">${resetLink}</code>
          </p>
          <p style="color: #999; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            This link expires in 24 hours. If you didn't request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
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

/**
 * Send lead magnet email with PDF attachment
 */
export async function sendLeadMagnetEmail(
  email: string,
  pdfUrl: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: email,
      subject: "Your Free Lead Magnet",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your interest!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Please find your requested resource attached or available at the link below.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${pdfUrl}" style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Download Your Resource
            </a>
          </div>
          
          <p style="color: #999; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            If you have any questions, feel free to reach out.
          </p>
        </div>
      `,
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
