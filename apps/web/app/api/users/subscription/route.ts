import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type { SubscriptionTier, SubscriptionStatus } from "@/lib/polar";
import { getAuthUserId } from "@/lib/api/auth";

export async function GET(request: Request) {
  const userId = await getAuthUserId(request);

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodEnd: true,
        polarCustomerId: true,
      },
    });

    return Response.json({
      tier: (user?.subscriptionTier as SubscriptionTier) || "free",
      status: (user?.subscriptionStatus as SubscriptionStatus) || null,
      currentPeriodEnd: user?.subscriptionCurrentPeriodEnd || null,
      hasPortalAccess: !!user?.polarCustomerId,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    // Graceful fallback - default to free tier
    return Response.json({
      tier: "free" as SubscriptionTier,
      status: null,
      currentPeriodEnd: null,
      hasPortalAccess: false,
    });
  }
}
