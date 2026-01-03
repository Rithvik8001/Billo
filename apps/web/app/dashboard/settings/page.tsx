import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let currencyCode = "USD";
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        currencyCode: true,
      },
    });
    currencyCode = user?.currencyCode || "USD";
  } catch (error: unknown) {
    // Handle case where currency_code column doesn't exist yet
    if (error instanceof Error && error.message?.includes("currency_code")) {
      console.warn(
        "currency_code column not found, using default USD. Please run migration."
      );
      currencyCode = "USD";
    } else {
      console.error("Error fetching user preferences:", error);
    }
  }

  return <SettingsClient initialCurrency={currencyCode} />;
}
