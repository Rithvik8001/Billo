import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReceiptsClient } from "./receipts-client";

export default async function ReceiptsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ReceiptsClient userId={userId} />;
}
