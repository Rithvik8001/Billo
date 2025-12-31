import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-lg text-muted-foreground/70">
          Manage your bills and split expenses with ease
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-foreground/60 mb-1">Name</p>
            <p className="font-medium text-lg">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/60 mb-1">Email</p>
            <p className="font-medium text-lg">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Recent Receipts</h3>
          <p className="text-sm text-foreground/60">
            No receipts yet. Start by scanning or entering a receipt manually.
          </p>
        </div>
        <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Balance Summary</h3>
          <p className="text-sm text-foreground/60">
            No balances to show. Split your first bill to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
