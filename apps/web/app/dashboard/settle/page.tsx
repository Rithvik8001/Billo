import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SettleUpClient } from "./settle-up-client";

export default async function SettleUpPage() {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Settle Up
        </h1>
        <p className="text-lg text-muted-foreground/70">
          Track who owes what and mark payments as settled
        </p>
      </div>

      <SettleUpClient userId={userId} />
    </div>
  );
}

