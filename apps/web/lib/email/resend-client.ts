import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration constants
// Use custom domain if RESEND_FROM_EMAIL is set, otherwise fallback to Resend default
export const EMAIL_CONFIG = {
  fromEmail: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  fromName: "Billo",
  replyTo: process.env.RESEND_REPLY_TO || "1017rithvik@gmail.com", // Users can still reply to your Gmail
} as const;
