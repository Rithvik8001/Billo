import { getAiScanUsage } from "@/lib/rate-limit";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import type { SubscriptionTier } from "@/lib/polar";
import { getAuthUserId } from "@/lib/api/auth";

export async function GET(request: Request) {
  const userId = await getAuthUserId(request);

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's subscription tier from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { subscriptionTier: true },
    });

    const tier = (user?.subscriptionTier as SubscriptionTier) || "free";
    const usage = await getAiScanUsage(userId, tier);

    return Response.json({
      aiScans: {
        ...usage,
        isLimited: usage.remaining === 0,
        isPro: tier === "pro",
      },
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return Response.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
