import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client (lazy initialization)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 3 AI scans per 24 hours per user
export const aiScanRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
  prefix: "billo:ai-scan",
});

export async function getAiScanUsage(userId: string) {
  try {
    // Upstash Ratelimit uses a specific key format for sliding window
    // Format: {prefix}:{identifier}:sliding_window
    const identifier = userId;
    const windowKey = `billo:ai-scan:${identifier}:sliding_window`;

    // Get current timestamp and window size (24 hours)
    const now = Date.now();
    const windowSizeMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const windowStart = now - windowSizeMs;

    // Use zcount to count entries in the sliding window without consuming
    // zcount returns the number of elements in the sorted set with scores between min and max
    const count = await redis.zcount(windowKey, windowStart, now);
    const remaining = Math.max(0, 3 - count);
    const resetsAt = new Date(now + windowSizeMs);
    return {
      remaining,
      limit: 3,
      used: count,
      resetsAt,
    };
  } catch (error) {
    // Fail open: if Redis is unavailable, allow the request
    console.error("Error checking AI scan usage:", error);
    return {
      remaining: 3,
      limit: 3,
      used: 0,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
  }
}

// Check and consume quota
export async function checkAiScanLimit(userId: string) {
  try {
    const { success, remaining, reset } = await aiScanRateLimiter.limit(userId);
    return {
      allowed: success,
      remaining,
      limit: 3,
      resetsAt: new Date(reset),
    };
  } catch (error) {
    // Fail open: if Redis is unavailable, allow the request
    console.error("Error checking AI scan limit:", error);
    return {
      allowed: true,
      remaining: 3,
      limit: 3,
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
  }
}
