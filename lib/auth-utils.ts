import { auth } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  try {
    const session = await auth.currentUser;
    if (!session?.email) return null;

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
