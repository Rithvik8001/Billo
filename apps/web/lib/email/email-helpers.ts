import { resend, EMAIL_CONFIG } from "./resend-client";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type {
  GroupInviteEmailData,
  SettlementEmailData,
  PaymentEmailData,
  WeeklySummaryData,
} from "./email-types";
import { AddedToGroupEmail } from "@/emails/added-to-group";
import { NewSettlementEmail } from "@/emails/new-settlement";
import { SettlementPaidEmail } from "@/emails/settlement-paid";
import { WeeklySummaryEmail } from "@/emails/weekly-summary";

/**
 * Fire-and-forget email sending wrapper
 * Logs errors but doesn't throw to prevent blocking main operations
 */
async function sendEmailSafely(
  emailFn: () => Promise<void>,
  context: string
): Promise<void> {
  try {
    await emailFn();
  } catch (error) {
    console.error(`[Email Error - ${context}]:`, error);
    // Don't throw - fire and forget
  }
}

/**
 * Check if user has enabled a specific email preference
 */
async function checkEmailPreference(
  userId: string,
  preferenceType:
    | "emailGroupInvites"
    | "emailSettlements"
    | "emailPayments"
    | "emailWeeklySummary"
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        emailGroupInvites: true,
        emailSettlements: true,
        emailPayments: true,
        emailWeeklySummary: true,
      },
    });
    return user?.[preferenceType] ?? true; // Default to true if not found
  } catch (error) {
    console.error(`Error checking email preference for ${userId}:`, error);
    return true; // Default to sending if check fails
  }
}

/**
 * Send group invitation email
 */
export async function sendGroupInviteEmail(
  data: GroupInviteEmailData
): Promise<void> {
  await sendEmailSafely(async () => {
    // Check user preference
    const enabled = await checkEmailPreference(
      data.newMemberId,
      "emailGroupInvites"
    );
    if (!enabled) {
      console.log(
        `Email skipped - user ${data.newMemberId} has disabled group invite emails`
      );
      return;
    }

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${data.newMemberId}&type=group_invites`;

    await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.newMemberEmail,
      subject: `You've been added to ${data.groupName}`,
      react: AddedToGroupEmail({
        memberName: data.newMemberName,
        groupName: data.groupName,
        groupEmoji: data.groupEmoji,
        addedByName: data.addedByName,
        groupUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/groups`,
        unsubscribeUrl,
      }),
    });

    console.log(`[Email] Group invite sent to ${data.newMemberEmail}`);
  }, "Group Invite");
}

/**
 * Send settlement created emails (to both payer and recipient)
 */
export async function sendSettlementEmails(
  settlements: SettlementEmailData[]
): Promise<void> {
  // Send emails in parallel (fire-and-forget for each)
  await Promise.all(
    settlements.map((settlement) =>
      sendEmailSafely(async () => {
        // Check preferences for both parties
        const [fromUserEnabled, toUserEnabled] = await Promise.all([
          checkEmailPreference(settlement.fromUserId, "emailSettlements"),
          checkEmailPreference(settlement.toUserId, "emailSettlements"),
        ]);

        const emails = [];

        // Email to person who owes (fromUser)
        if (fromUserEnabled) {
          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${settlement.fromUserId}&type=settlements`;
          emails.push(
            resend.emails.send({
              from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
              to: settlement.fromUserEmail,
              subject: `You owe ${settlement.formattedAmount} to ${settlement.toUserName}`,
              react: NewSettlementEmail({
                recipientName: settlement.fromUserName,
                amount: settlement.formattedAmount,
                currency: settlement.currency,
                merchantName: settlement.merchantName,
                isOwed: false,
                otherPersonName: settlement.toUserName,
                groupName: settlement.groupName,
                settlementUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settle`,
                unsubscribeUrl,
              }),
            })
          );
        }

        // Email to person who is owed (toUser)
        if (toUserEnabled) {
          const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${settlement.toUserId}&type=settlements`;
          emails.push(
            resend.emails.send({
              from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
              to: settlement.toUserEmail,
              subject: `${settlement.fromUserName} owes you ${settlement.formattedAmount}`,
              react: NewSettlementEmail({
                recipientName: settlement.toUserName,
                amount: settlement.formattedAmount,
                currency: settlement.currency,
                merchantName: settlement.merchantName,
                isOwed: true,
                otherPersonName: settlement.fromUserName,
                groupName: settlement.groupName,
                settlementUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settle`,
                unsubscribeUrl,
              }),
            })
          );
        }

        await Promise.all(emails);
        console.log(
          `[Email] Settlement emails sent for ${settlement.merchantName}`
        );
      }, `Settlement ${settlement.fromUserId}->${settlement.toUserId}`)
    )
  );
}

/**
 * Send payment confirmation emails (to both parties)
 */
export async function sendPaymentConfirmationEmail(
  data: PaymentEmailData
): Promise<void> {
  await sendEmailSafely(async () => {
    // Check preferences for both parties
    const [fromUserEnabled, toUserEnabled] = await Promise.all([
      checkEmailPreference(data.fromUserId, "emailPayments"),
      checkEmailPreference(data.toUserId, "emailPayments"),
    ]);

    const emails = [];

    // Email to payer (fromUser)
    if (fromUserEnabled) {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${data.fromUserId}&type=payments`;
      emails.push(
        resend.emails.send({
          from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
          to: data.fromUserEmail,
          subject: "Payment Confirmed",
          react: SettlementPaidEmail({
            recipientName: data.fromUserName,
            amount: data.formattedAmount,
            otherPersonName: data.toUserName,
            merchantName: data.merchantName,
            isReceiver: false,
            settledAt: data.settledAt,
            unsubscribeUrl,
          }),
        })
      );
    }

    // Email to receiver (toUser)
    if (toUserEnabled) {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${data.toUserId}&type=payments`;
      emails.push(
        resend.emails.send({
          from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
          to: data.toUserEmail,
          subject: "Payment Received",
          react: SettlementPaidEmail({
            recipientName: data.toUserName,
            amount: data.formattedAmount,
            otherPersonName: data.fromUserName,
            merchantName: data.merchantName,
            isReceiver: true,
            settledAt: data.settledAt,
            unsubscribeUrl,
          }),
        })
      );
    }

    await Promise.all(emails);
    console.log(
      `[Email] Payment confirmation emails sent for settlement ${data.settlementId}`
    );
  }, "Payment Confirmation");
}

/**
 * Send weekly summary email to a single user
 */
export async function sendWeeklySummaryEmail(
  data: WeeklySummaryData
): Promise<void> {
  await sendEmailSafely(async () => {
    // Check user preference
    const enabled = await checkEmailPreference(
      data.userId,
      "emailWeeklySummary"
    );
    if (!enabled) {
      console.log(
        `Email skipped - user ${data.userId} has disabled weekly summary emails`
      );
      return;
    }

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/unsubscribe?userId=${data.userId}&type=weekly_summary`;

    await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: data.userEmail,
      subject: "Your Weekly Billo Summary",
      react: WeeklySummaryEmail({
        userName: data.userName,
        totalYouOwe: data.totalYouOwe,
        totalOwedToYou: data.totalOwedToYou,
        netBalance: data.netBalance,
        pendingSettlements: data.pendingSettlements,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        unsubscribeUrl,
      }),
    });

    console.log(`[Email] Weekly summary sent to ${data.userEmail}`);
  }, "Weekly Summary");
}
