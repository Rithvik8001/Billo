import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SettleUpClient } from "./settle-up-client";

export default async function SettleUpPage() {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  return <SettleUpClient userId={userId} />;
}

