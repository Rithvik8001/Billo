import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col justify-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-lg text-foreground/60 mt-4">
                Sign in to continue splitting bills with ease.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Scan receipts instantly</h3>
                  <p className="text-sm text-foreground/60">
                    Snap a photo and let AI do the work
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Split bills fairly</h3>
                  <p className="text-sm text-foreground/60">
                    Tap your items and see who owes what
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Settle up easily</h3>
                  <p className="text-sm text-foreground/60">
                    Track payments and balances in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
