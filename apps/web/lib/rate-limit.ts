import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { SCAN_LIMITS, type SubscriptionTier } from "./polar";

// Create Redis client (lazy initialization)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for each tier
const freeRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(SCAN_LIMITS.free, "24 h"),
  prefix: "billo:ai-scan:free",
});

const proRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(SCAN_LIMITS.pro, "24 h"),
  prefix: "billo:ai-scan:pro",
});

// Get the appropriate rate limiter for a tier
function getRateLimiter(tier: SubscriptionTier) {
  return tier === "pro" ? proRateLimiter : freeRateLimiter;
}

// Get scan limit for a tier
export function getScanLimit(tier: SubscriptionTier): number {
  return SCAN_LIMITS[tier] || SCAN_LIMITS.free;
}

export async function getAiScanUsage(
  userId: string,
  tier: SubscriptionTier = "free"
) {
  try {
    const limit = getScanLimit(tier);
    const prefix = tier === "pro" ? "billo:ai-scan:pro" : "billo:ai-scan:free";
    const windowKey = `${prefix}:${userId}:sliding_window`;

    // Get current timestamp and window size (24 hours)
    const now = Date.now();
    const windowSizeMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const windowStart = now - windowSizeMs;

    // Use zcount to count entries in the sliding window without consuming
    const count = await redis.zcount(windowKey, windowStart, now);
    const remaining = Math.max(0, limit - count);
    const resetsAt = new Date(now + windowSizeMs);

    return {
      remaining,
      limit,
      used: count,
      resetsAt,
      tier,
    };
  } catch (error) {
    // Fail open: if Redis is unavailable, allow the request
    console.error("Error checking AI scan usage:", error);
    const limit = getScanLimit(tier);
    return {
      remaining: limit,
      limit,
      used: 0,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      tier,
    };
  }
}

// Check and consume quota
export async function checkAiScanLimit(
  userId: string,
  tier: SubscriptionTier = "free"
) {
  try {
    const limiter = getRateLimiter(tier);
    const { success, remaining, reset } = await limiter.limit(userId);
    return {
      allowed: success,
      remaining,
      limit: getScanLimit(tier),
      resetsAt: new Date(reset),
      tier,
    };
  } catch (error) {
    // Fail open: if Redis is unavailable, allow the request
    console.error("Error checking AI scan limit:", error);
    const limit = getScanLimit(tier);
    return {
      allowed: true,
      remaining: limit,
      limit,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      tier,
    };
  }
}
