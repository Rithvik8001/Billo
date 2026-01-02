import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Auto-create user in database if they don't exist
  try {
    const user = await currentUser();
    if (user) {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!existingUser) {
        // Validate email exists
        const email = user.emailAddresses[0]?.emailAddress;
        if (!email) {
          console.error("User has no email address");
          redirect("/sign-in");
        }

        await db.insert(users).values({
          id: userId,
          clerkUserId: userId,
          email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
          imageUrl: user.imageUrl || null,
        });
        console.log(`✅ User auto-created: ${userId}`);
      }
    }
  } catch (error) {
    // Log error but don't crash the page
    console.error("Failed to auto-create user:", error);
    // User can still access dashboard, will be created on next visit
  }

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
