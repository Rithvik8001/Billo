import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { CurrencyProviderWrapper } from "@/components/currency-provider-wrapper";
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

  // Auto-create user in database if they don't exist and fetch currency preference
  let currencyCode = "USD";
  try {
    const user = await currentUser();
    if (user) {
      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: {
            currencyCode: true,
          },
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
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
            imageUrl: user.imageUrl || null,
            currencyCode: "USD",
          });
          console.log(`✅ User auto-created: ${userId}`);
        } else {
          currencyCode = existingUser.currencyCode || "USD";
        }
      } catch (dbError: unknown) {
        // Handle case where currency_code column doesn't exist yet
        if (
          dbError instanceof Error &&
          dbError.message?.includes("currency_code")
        ) {
          console.warn(
            "currency_code column not found, using default USD. Please run migration."
          );
          currencyCode = "USD";
        } else {
          throw dbError;
        }
      }
    }
  } catch (error) {
    // Log error but don't crash the page
    console.error("Failed to auto-create user:", error);
    // User can still access dashboard, will be created on next visit
  }

  return (
    <CurrencyProviderWrapper initialCurrency={currencyCode}>
      <div className="min-h-screen bg-white">
        <TopNav />
        <main className="pt-16">
          <div className="max-w-3xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </CurrencyProviderWrapper>
  );
}
