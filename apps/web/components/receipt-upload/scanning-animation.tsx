"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ScanningAnimationProps {
  imageUrl: string;
}

export function ScanningAnimation({ imageUrl }: ScanningAnimationProps) {
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:w-64 shrink-0">
      <Image
        src={imageUrl}
        alt="Receipt being scanned"
        width={256}
        height={256}
        className="w-full h-auto rounded-lg object-contain border"
        unoptimized
      />

      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div
          className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-70 transition-all duration-75"
          style={{
            top: `${scanPosition}%`,
            boxShadow: "0 0 20px 4px hsl(var(--primary))",
          }}
        />

        <div
          className="absolute left-0 right-0 h-8 bg-linear-to-b from-primary/30 to-transparent transition-all duration-75"
          style={{
            top: `${scanPosition}%`,
          }}
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
        <div className="relative flex items-center justify-center">
          <div className="absolute size-2 bg-white rounded-full animate-ping" />
          <div className="size-2 bg-white rounded-full" />
        </div>
        Scanning...
      </div>
    </div>
  );
}
