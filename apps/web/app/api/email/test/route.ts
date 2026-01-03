import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resend, EMAIL_CONFIG } from "@/lib/email/resend-client";
import { AddedToGroupEmail } from "@/emails/added-to-group";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toEmail = searchParams.get("to");

    if (!toEmail) {
      return NextResponse.json(
        {
          error:
            "Missing 'to' query parameter. Usage: /api/email/test?to=rithvik.p1188@gmail.com",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send test email
    const result = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: toEmail,
      subject: "Test Email from Billo",
      react: AddedToGroupEmail({
        memberName: "Test User",
        groupName: "Test Group",
        groupEmoji: "🧪",
        addedByName: "Billo Team",
        groupUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://billo.sh"}/dashboard/groups`,
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://billo.sh"}/api/email/unsubscribe?userId=${userId}&type=group_invites`,
      }),
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailId: result.data?.id || "unknown",
      fromEmail: EMAIL_CONFIG.fromEmail,
      toEmail,
      config: {
        fromName: EMAIL_CONFIG.fromName,
        replyTo: EMAIL_CONFIG.replyTo,
        usingCustomDomain: !!process.env.RESEND_FROM_EMAIL,
      },
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
        fromEmail: EMAIL_CONFIG.fromEmail,
        usingCustomDomain: !!process.env.RESEND_FROM_EMAIL,
      },
      { status: 500 }
    );
  }
}
