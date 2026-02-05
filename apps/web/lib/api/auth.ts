import { auth, verifyToken } from "@clerk/nextjs/server";

export async function getAuthUserId(request?: Request): Promise<string | null> {
  const { userId } = await auth();
  if (userId) {
    return userId;
  }

  if (!request) {
    return null;
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : authHeader;

  if (!token) {
    return null;
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload?.sub || null;
  } catch (error) {
    console.error("Bearer token verification failed:", error);
    return null;
  }
}
