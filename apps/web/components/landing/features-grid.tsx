"use client";

import { motion } from "motion/react";
import { Scan, Users, UserPlus, ArrowRightLeft, Globe, Mail } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const features = [
  {
    icon: Scan,
    title: "AI Receipt Scanning",
    description: "Snap a photo, AI extracts items instantly using Gemini 2.5 Flash. No manual typing needed.",
  },
  {
    icon: Users,
    title: "Tap to Assign",
    description: "Tap items to assign to people, see who owes what. Split bills with a simple tap.",
  },
  {
    icon: UserPlus,
    title: "Groups",
    description: "Create groups for roommates, trips, or any shared expense. Manage multiple groups effortlessly.",
  },
  {
    icon: ArrowRightLeft,
    title: "Smart Settlements",
    description: "Auto-calculate balances, track who paid whom. See all settlements in one place.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Support for 8 currencies with user preferences. Perfect for international groups.",
  },
  {
    icon: Mail,
    title: "Email Notifications",
    description: "Stay updated on settlements and weekly summaries. Never miss a payment reminder.",
  },
];

export default function FeaturesGrid() {
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
            Everything you need to split bills
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Powerful features designed to make bill splitting effortless and accurate.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-background p-8 border border-border/60 -m-px hover:bg-muted/30 transition-colors"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: index * 0.05 }}
            >
              <feature.icon className="size-6 text-foreground mb-4" />
              <h3 className="text-h3 font-semibold text-foreground mb-2 tracking-[-0.02em]">
                {feature.title}
              </h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

