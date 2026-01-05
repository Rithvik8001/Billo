"use client";

import { motion } from "motion/react";
import { fadeInUp } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "3 AI scans per day",
      "Unlimited manual entries",
      "Unlimited groups",
      "Smart settlements",
      "Multi-currency support",
      "Email notifications",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$2.99",
    period: "per month",
    features: [
      "50 AI scans per day",
      "Unlimited manual entries",
      "Unlimited groups",
      "Smart settlements",
      "Multi-currency support",
      "Email notifications",
      "Priority support",
      "Early access to features",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
];

export default function PricingSection() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCta = (planName: string) => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }
    if (planName === "Pro") {
      router.push("/dashboard/settings");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className="py-24 px-4 md:px-6 border-b border-border/60">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.h2
            className="text-h1 md:text-[40px] font-semibold text-foreground mb-4 tracking-[-0.03em]"
            variants={fadeInUp}
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Start free, upgrade when you need more AI scans.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/60">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`bg-background p-8 md:p-12 border border-border/60 -m-px ${
                plan.highlight ? "md:border-2 md:border-primary" : ""
              }`}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-8">
                <h3 className="text-h2 font-semibold text-foreground mb-2 tracking-[-0.03em]">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-semibold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-body text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="size-5 text-foreground shrink-0 mt-0.5" />
                    <span className="text-body text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCta(plan.name)}
                variant={plan.highlight ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

