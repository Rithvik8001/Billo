"use client";

import Image from "next/image";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { scaleIn, fadeInUp } from "@/lib/motion";

interface CompletedStateProps {
  imageUrl?: string;
  itemCount: number;
  extractedData?: { items?: unknown[] };
  onRetry?: () => void;
}

export function CompletedState({
  imageUrl,
  itemCount,
  extractedData,
  onRetry,
}: CompletedStateProps) {
  const hasItems = itemCount > 0 || (extractedData?.items && extractedData.items.length > 0);
  const actualItemCount = itemCount || extractedData?.items?.length || 0;

  return (
    <div className="bg-background border rounded-xl p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        {hasItems ? (
          <>
            <motion.div
              className="bg-muted rounded-full p-6 mb-4"
              initial={scaleIn.initial}
              animate={scaleIn.animate}
              transition={scaleIn.transition}
            >
              <CheckCircle2 className="size-12 text-muted-foreground" />
            </motion.div>
            <motion.h3
              className="text-h3 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              Receipt Processed!
            </motion.h3>
            <motion.p
              className="text-body text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Successfully extracted {actualItemCount} {actualItemCount === 1 ? "item" : "items"}
            </motion.p>
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mb-6"
              >
                <Image
                  src={imageUrl}
                  alt="Receipt"
                  width={512}
                  height={512}
                  className="w-full max-w-md h-auto rounded-lg object-contain border"
                  unoptimized
                />
              </motion.div>
            )}
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              Redirecting to receipt review...
            </motion.p>
          </>
        ) : (
          <>
            <motion.div
              className="bg-muted rounded-full p-6 mb-4"
              initial={scaleIn.initial}
              animate={scaleIn.animate}
              transition={scaleIn.transition}
            >
              <AlertCircle className="size-12 text-muted-foreground" />
            </motion.div>
            <motion.h3
              className="text-h3 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              No Receipt Detected
            </motion.h3>
            <motion.p
              className="text-body text-muted-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              Image uploaded successfully, but no items were detected.
            </motion.p>
            <motion.p
              className="text-small text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              This might not be a receipt, or the image quality is too low. Please try uploading a clear receipt image.
            </motion.p>
            {imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mb-6"
              >
                <Image
                  src={imageUrl}
                  alt="Uploaded image"
                  width={512}
                  height={512}
                  className="w-full max-w-md h-auto rounded-lg object-contain border"
                  unoptimized
                />
              </motion.div>
            )}
            {onRetry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Button
                  onClick={onRetry}
                >
                  Try Another Image
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

