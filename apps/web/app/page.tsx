import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Landing from "@/components/landing/landing-page";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <Landing />;
}
