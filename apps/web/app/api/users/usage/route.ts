import { auth } from "@clerk/nextjs/server";
import { getAiScanUsage } from "@/lib/rate-limit";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await getAiScanUsage(userId);
    return Response.json({
      aiScans: {
        ...usage,
        isLimited: usage.remaining === 0,
      },
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return Response.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
