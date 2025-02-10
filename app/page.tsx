import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, PieChart, Wallet } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 mx-auto max-w-7xl">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">
              Smart Expense Tracking
              <br />
              for Modern Life
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take control of your finances with Billo. Track expenses, set
              budgets, and make informed decisions with beautiful analytics.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 group">
                  Get Started{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="transition-colors hover:text-primary"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 bg-muted/50">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
              Why Choose Billo?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Wallet,
                  title: "Easy Expense Logging",
                  description:
                    "Quick and intuitive expense tracking with smart categorization",
                  delay: "0",
                },
                {
                  icon: BarChart3,
                  title: "Smart Analytics",
                  description:
                    "Visualize your spending patterns with beautiful charts and insights",
                  delay: "200",
                },
                {
                  icon: PieChart,
                  title: "Budget Management",
                  description:
                    "Set and track budgets with real-time alerts and notifications",
                  delay: "400",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 rounded-lg transition-colors hover:bg-muted animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${feature.delay}ms`,
                    animationDuration: "700ms",
                    animationFillMode: "both",
                  }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p> 2024 Billo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
