"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Crown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UsageIndicatorProps {
  remaining: number;
  limit: number;
  resetsAt?: Date;
  isLoading?: boolean;
  isPro?: boolean;
}

export function UsageIndicator({
  remaining,
  limit,
  resetsAt,
  isLoading,
  isPro,
}: UsageIndicatorProps) {
  if (isLoading) {
    return (
      <Badge variant="ghost" className="animate-pulse">
        Loading...
      </Badge>
    );
  }

  // Show Pro badge for Pro users
  if (isPro) {
    return (
      <Badge variant="default" className="gap-1.5 bg-primary">
        <Crown className="size-3" />
        <span>Pro</span>
      </Badge>
    );
  }

  const isLimited = remaining === 0;
  const isWarning = remaining === 1;

  if (isLimited && resetsAt) {
    const resetTime = formatDistanceToNow(resetsAt, { addSuffix: true });
    return (
      <Badge variant="destructive" className="gap-1.5">
        <AlertTriangle className="size-3" />
        <span>Limit reached • Resets {resetTime}</span>
      </Badge>
    );
  }

  if (isWarning) {
    return (
      <Badge variant="warning" className="gap-1.5">
        <AlertTriangle className="size-3" />
        <span>
          {remaining}/{limit} scan{remaining !== 1 ? "s" : ""} remaining
        </span>
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-1.5">
      <CheckCircle2 className="size-3" />
      <span>
        {remaining}/{limit} scan{remaining !== 1 ? "s" : ""} remaining
      </span>
    </Badge>
  );
}
