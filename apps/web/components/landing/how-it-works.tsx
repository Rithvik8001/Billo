"use client";

import { motion } from "motion/react";
import { fadeInUp } from "@/lib/motion";
import { Camera, Hand, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Camera,
    title: "Scan or Enter",
    description: "Upload a receipt photo and let AI extract items automatically, or add items manually for full control.",
  },
  {
    number: 2,
    icon: Hand,
    title: "Assign Items",
    description: "Tap items to assign them to group members. See totals update in real-time as you split.",
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: "Settle Up",
    description: "View balances and mark payments as complete. Track who owes what across all your groups.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-6 border-b border-border/60">
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
            How it works
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Three simple steps to split any bill effortlessly.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/60">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="bg-background p-8 md:p-12 border border-border/60 -m-px"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg shrink-0">
                  {step.number}
                </div>
                <step.icon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-h3 font-semibold text-foreground mb-3 tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

