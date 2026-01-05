"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { UpgradeCta } from "./upgrade-cta";
import { format } from "date-fns";

export function SubscriptionSection() {
  const { subscription, isLoading, isPro } = useSubscription();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !isPro) {
    return <UpgradeCta variant="card" />;
  }

  const handleManageSubscription = () => {
    window.location.href = "/api/polar/portal";
  };

  const isCanceled = subscription.status === "canceled";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="size-5 text-primary" />
            Billo Pro
          </CardTitle>
          <Badge variant={isCanceled ? "secondary" : "default"}>
            {isCanceled ? "Canceling" : "Active"}
          </Badge>
        </div>
        <CardDescription>
          {subscription.currentPeriodEnd &&
            (isCanceled
              ? `Access until ${format(subscription.currentPeriodEnd, "MMMM d, yyyy")}`
              : `Renews ${format(subscription.currentPeriodEnd, "MMMM d, yyyy")}`)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCanceled && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm">
            <AlertCircle className="size-4 text-yellow-600 mt-0.5 shrink-0" />
            <span>
              Your subscription has been canceled and will end on{" "}
              {subscription.currentPeriodEnd &&
                format(subscription.currentPeriodEnd, "MMMM d, yyyy")}
              .
            </span>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>50 AI scans per day included</p>
        </div>

        {subscription.hasPortalAccess && (
          <Button
            onClick={handleManageSubscription}
            variant="outline"
            className="w-full gap-2"
          >
            <ExternalLink className="size-4" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
