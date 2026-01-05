"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useSpring, MotionValue } from "motion/react";
import { springConfig } from "@/lib/motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  decimals?: number;
  formatValue?: (num: number) => string;
}

/**
 * Animated number component that counts up from 0 to the target value
 * Used for balance displays and counters
 */
export function AnimatedNumber({
  value,
  duration = 600,
  className = "",
  decimals = 2,
  formatValue,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    ...springConfig,
    duration: duration,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <AnimatedNumberDisplay
      motionValue={spring}
      className={className}
      decimals={decimals}
      formatValue={formatValue}
    />
  );
}

/**
 * Internal component that subscribes to motion value changes
 */
function AnimatedNumberDisplay({
  motionValue,
  className,
  decimals,
  formatValue,
}: {
  motionValue: MotionValue<number>;
  className: string;
  decimals: number;
  formatValue?: (num: number) => string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return unsubscribe;
  }, [motionValue]);

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : displayValue.toFixed(decimals);

  return <span className={className}>{formattedValue}</span>;
}

