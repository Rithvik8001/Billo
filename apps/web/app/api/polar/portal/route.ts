import { CustomerPortal } from "@polar-sh/nextjs";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/config/connection";
import { users } from "@/db/models/schema";
import { eq } from "drizzle-orm";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_MODE as "sandbox" | "production") || "sandbox",
  getCustomerId: async () => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { polarCustomerId: true },
    });

    if (!user?.polarCustomerId) {
      throw new Error("No subscription found");
    }

    return user.polarCustomerId;
  },
});
