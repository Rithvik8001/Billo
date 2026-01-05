import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CurrencyProviderWrapper } from "@/components/currency-provider-wrapper";
import { PageTransition } from "@/components/ui/page-transition";
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <main className="flex-1">
              <div className="max-w-[900px] mx-auto px-8 py-12">
                <PageTransition>{children}</PageTransition>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </CurrencyProviderWrapper>
  );
}
