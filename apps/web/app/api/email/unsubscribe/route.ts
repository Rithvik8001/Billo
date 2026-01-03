import { NextResponse } from "next/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type { EmailPreferenceType } from "@/lib/email/email-types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") as EmailPreferenceType;

    if (!userId || !type) {
      return NextResponse.json(
        { error: "Missing userId or type parameter" },
        { status: 400 }
      );
    }

    // Map URL parameter to database column
    const columnMap: Record<EmailPreferenceType, string> = {
      group_invites: "emailGroupInvites",
      settlements: "emailSettlements",
      payments: "emailPayments",
      weekly_summary: "emailWeeklySummary",
    };

    const column = columnMap[type];
    if (!column) {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
    }

    // Update user preference
    await db
      .update(users)
      .set({
        [column]: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Return HTML page confirming unsubscribe
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Billo</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              max-width: 600px;
              margin: 100px auto;
              padding: 20px;
              text-align: center;
              background-color: #F4EDEB;
            }
            .card {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #F97316;
              font-size: 28px;
              margin: 0 0 16px 0;
            }
            p {
              color: #374151;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 16px 0;
            }
            a {
              color: #F97316;
              text-decoration: none;
              font-weight: 600;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>You've been unsubscribed</h1>
            <p>You will no longer receive ${type.replace("_", " ")} emails from Billo.</p>
            <p>You can manage your email preferences in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">account settings</a>.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}
