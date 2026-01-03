import { NextResponse } from "next/server";
import db from "@/db/config/connection";
import { users, settlements } from "@/db/models/schema";
import { eq, and } from "drizzle-orm";
import { sendWeeklySummaryEmail } from "@/lib/email/email-helpers";
import { formatAmount } from "@/lib/currency";
import type { WeeklySummaryData } from "@/lib/email/email-types";

export async function GET(request: Request) {
  try {
    // Verify request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting weekly digest generation...");

    // Fetch all users with weekly summary enabled
    const usersWithEmailEnabled = await db.query.users.findMany({
      where: eq(users.emailWeeklySummary, true),
      columns: {
        id: true,
        name: true,
        email: true,
        currencyCode: true,
      },
    });

    console.log(
      `[Cron] Found ${usersWithEmailEnabled.length} users with weekly digest enabled`
    );

    // Send emails in parallel (fire-and-forget)
    const emailPromises = usersWithEmailEnabled.map(async (user) => {
      try {
        // Get pending settlements for this user
        const [settlementsOwed, settlementsOwedTo] = await Promise.all([
          // User owes money
          db.query.settlements.findMany({
            where: and(
              eq(settlements.fromUserId, user.id),
              eq(settlements.status, "pending")
            ),
            with: {
              toUser: {
                columns: { name: true },
              },
              receipt: {
                columns: { merchantName: true },
              },
            },
          }),
          // User is owed money
          db.query.settlements.findMany({
            where: and(
              eq(settlements.toUserId, user.id),
              eq(settlements.status, "pending")
            ),
            with: {
              fromUser: {
                columns: { name: true },
              },
              receipt: {
                columns: { merchantName: true },
              },
            },
          }),
        ]);

        // Skip users with no pending activity
        if (settlementsOwed.length === 0 && settlementsOwedTo.length === 0) {
          console.log(
            `[Cron] Skipping user ${user.id} - no pending settlements`
          );
          return;
        }

        // Calculate totals
        const totalYouOwe = settlementsOwed.reduce(
          (sum, s) => sum + parseFloat(s.amount),
          0
        );
        const totalOwedToYou = settlementsOwedTo.reduce(
          (sum, s) => sum + parseFloat(s.amount),
          0
        );
        const netBalance = totalYouOwe - totalOwedToYou;

        // Format pending settlements
        const pendingSettlements = [
          ...settlementsOwed.map((s) => ({
            id: s.id,
            otherPersonName: s.toUser.name || "Unknown",
            amount: formatAmount(s.amount, user.currencyCode),
            merchantName: s.receipt?.merchantName || "Unknown",
            type: "owe" as const,
          })),
          ...settlementsOwedTo.map((s) => ({
            id: s.id,
            otherPersonName: s.fromUser.name || "Unknown",
            amount: formatAmount(s.amount, user.currencyCode),
            merchantName: s.receipt?.merchantName || "Unknown",
            type: "owed" as const,
          })),
        ];

        const emailData: WeeklySummaryData = {
          userId: user.id,
          userName: user.name || "there",
          userEmail: user.email,
          totalYouOwe: formatAmount(totalYouOwe, user.currencyCode),
          totalOwedToYou: formatAmount(totalOwedToYou, user.currencyCode),
          netBalance: formatAmount(Math.abs(netBalance), user.currencyCode),
          pendingSettlements,
        };

        await sendWeeklySummaryEmail(emailData);
      } catch (error) {
        console.error(
          `[Cron] Error sending weekly summary to ${user.id}:`,
          error
        );
        // Continue with other users even if one fails
      }
    });

    await Promise.all(emailPromises);

    console.log("[Cron] Weekly digest generation completed");
    return NextResponse.json({
      success: true,
      usersProcessed: usersWithEmailEnabled.length,
    });
  } catch (error) {
    console.error("[Cron] Error in weekly digest:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly digest" },
      { status: 500 }
    );
  }
}
