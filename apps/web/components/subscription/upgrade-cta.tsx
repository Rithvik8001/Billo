"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, Sparkles, ScanLine } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface UpgradeCtaProps {
  variant?: "card" | "inline" | "banner";
  showPrice?: boolean;
}

export function UpgradeCta({
  variant = "card",
  showPrice = true,
}: UpgradeCtaProps) {
  const { user } = useUser();

  const handleUpgrade = () => {
    // Build checkout URL with customer external ID for linking
    const checkoutUrl = new URL("/api/polar/checkout", window.location.origin);
    checkoutUrl.searchParams.set(
      "products",
      process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID || ""
    );
    if (user?.id) {
      checkoutUrl.searchParams.set("customerExternalId", user.id);
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      checkoutUrl.searchParams.set(
        "customerEmail",
        user.emailAddresses[0].emailAddress
      );
    }
    if (user?.fullName) {
      checkoutUrl.searchParams.set("customerName", user.fullName);
    }

    window.location.href = checkoutUrl.toString();
  };

  if (variant === "inline") {
    return (
      <Button onClick={handleUpgrade} className="gap-2">
        <Crown className="size-4" />
        Upgrade to Pro
      </Button>
    );
  }

  if (variant === "banner") {
    return (
      <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="size-5 text-primary" />
          <span className="font-medium">
            Upgrade to Billo Pro for 50 scans/day
          </span>
        </div>
        <Button onClick={handleUpgrade} size="sm">
          {showPrice ? "$2.99/mo" : "Upgrade"}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="size-5 text-primary" />
          Billo Pro
        </CardTitle>
        <CardDescription>Unlock more AI receipt scanning power</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <ScanLine className="size-4 text-primary" />
            <span>50 AI scans per day (vs 3 free)</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span>Priority processing</span>
          </li>
        </ul>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">$2.99</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <Button onClick={handleUpgrade} className="w-full gap-2">
          <Crown className="size-4" />
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
}
