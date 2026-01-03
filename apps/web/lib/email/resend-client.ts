import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration constants
export const EMAIL_CONFIG = {
  fromEmail: "onboarding@resend.dev",
  fromName: "Billo",
  replyTo: "1017rithvik@gmail.com", // Users can still reply to your Gmail
} as const;
