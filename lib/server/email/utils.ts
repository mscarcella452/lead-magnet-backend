import "server-only";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const getAppUrl = () => process.env.APP_URL || "http://localhost:3000";
export const getEmailFrom = () => process.env.EMAIL_FROM || "noreply@example.com";
