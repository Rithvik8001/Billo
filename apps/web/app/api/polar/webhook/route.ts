import { Webhooks } from "@polar-sh/nextjs";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  // Subscription becomes active (new subscription or renewal)
  onSubscriptionActive: async (payload) => {
    const subscription = payload.data;
    const customerId = subscription.customer.externalId;

    if (!customerId) {
      console.error("No external customer ID found in subscription");
      return;
    }

    try {
      await db
        .update(users)
        .set({
          subscriptionTier: "pro",
          polarCustomerId: subscription.customerId,
          polarSubscriptionId: subscription.id,
          subscriptionStatus: "active",
          subscriptionCurrentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, customerId));

      console.log(`Subscription activated for user ${customerId}`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  },

  // Subscription canceled (but still active until period end)
  onSubscriptionCanceled: async (payload) => {
    const subscription = payload.data;
    const customerId = subscription.customer.externalId;

    if (!customerId) {
      console.error("No external customer ID found in subscription");
      return;
    }

    try {
      await db
        .update(users)
        .set({
          subscriptionStatus: "canceled",
          updatedAt: new Date(),
        })
        .where(eq(users.id, customerId));

      console.log(`Subscription canceled for user ${customerId}`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  },

  // Subscription revoked (access removed - period ended or payment failed)
  onSubscriptionRevoked: async (payload) => {
    const subscription = payload.data;
    const customerId = subscription.customer.externalId;

    if (!customerId) {
      console.error("No external customer ID found in subscription");
      return;
    }

    try {
      await db
        .update(users)
        .set({
          subscriptionTier: "free",
          subscriptionStatus: null,
          polarSubscriptionId: null,
          subscriptionCurrentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, customerId));

      console.log(`Subscription revoked for user ${customerId}`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  },

  // Subscription uncanceled (user reactivated before period end)
  onSubscriptionUncanceled: async (payload) => {
    const subscription = payload.data;
    const customerId = subscription.customer.externalId;

    if (!customerId) {
      console.error("No external customer ID found in subscription");
      return;
    }

    try {
      await db
        .update(users)
        .set({
          subscriptionStatus: "active",
          updatedAt: new Date(),
        })
        .where(eq(users.id, customerId));

      console.log(`Subscription uncanceled for user ${customerId}`);
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  },

  // Subscription updated (renewals, plan changes, etc.)
  onSubscriptionUpdated: async (payload) => {
    const subscription = payload.data;
    const customerId = subscription.customer.externalId;

    if (!customerId) {
      console.error("No external customer ID found in subscription");
      return;
    }

    try {
      await db
        .update(users)
        .set({
          subscriptionCurrentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, customerId));

      console.log(`Subscription updated for user ${customerId}`);
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },
});
