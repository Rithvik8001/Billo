"use client";

import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { fadeInUp, staggerContainerFast, springConfig } from "@/lib/motion";

export default function Header() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleScanReceipt = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
  };

  const handleEnterManually = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
  };

  const titleWords = ["Scan.", "Tap.", "Split."];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[85vh] px-4"
      {...staggerContainerFast}
    >
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-foreground text-center mb-3 tracking-tight leading-tight"
        initial="initial"
        animate="animate"
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            {word}
            {index < titleWords.length - 1 && " "}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-muted-foreground/70 text-center max-w-2xl mb-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.4,
          ease: "easeOut",
        }}
      >
        Snap the receipt, tap your items, see who owes what.
      </motion.p>
      <motion.div
        className="flex flex-col gap-4 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...springConfig,
          delay: 0.6,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...springConfig,
            delay: 0.7,
          }}
        >
          <Button
            onClick={handleScanReceipt}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 h-auto text-base rounded-2xl"
          >
            <Camera className="w-5 h-5 mr-2" />
            Scan Receipt
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...springConfig,
            delay: 0.8,
          }}
        >
          <Button
            onClick={handleEnterManually}
            variant="outline"
            className="w-full bg-background hover:bg-muted text-foreground font-semibold py-5 h-auto text-base rounded-2xl"
          >
            Enter Manually
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
