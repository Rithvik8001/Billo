"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { fadeInUp, springConfig } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <section className="relative border-b border-border/60">
      <div className="grid-pattern absolute inset-0 opacity-50" />
      <motion.div
        className="relative flex flex-col items-center justify-center pt-32 pb-24 px-4 md:pt-40 md:pb-32 max-w-4xl mx-auto"
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <motion.h1
          className="text-display md:text-[64px] font-semibold text-foreground text-center mb-6 tracking-[-0.04em] leading-tight max-w-4xl"
          variants={fadeInUp}
        >
          Split bills in seconds, not spreadsheets.
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-12 leading-relaxed"
          variants={fadeInUp}
        >
          Snap a photo of your receipt, tap items to assign to people, and instantly see who owes what. No more manual calculations or awkward conversations.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          variants={fadeInUp}
        >
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="w-full sm:w-auto"
          >
            Get Started Free
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="#how-it-works">
              See How It Works
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
