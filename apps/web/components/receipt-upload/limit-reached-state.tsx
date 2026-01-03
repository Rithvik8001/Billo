"use client";

import { AlertCircle, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface LimitReachedStateProps {
  resetsAt: Date;
}

export function LimitReachedState({ resetsAt }: LimitReachedStateProps) {
  const resetTime = formatDistanceToNow(resetsAt, { addSuffix: true });

  return (
    <Card className="p-8 md:p-12">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="bg-yellow-500/10 rounded-full p-6">
          <AlertCircle className="size-16 text-yellow-600 dark:text-yellow-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Daily Scan Limit Reached</h2>
          <p className="text-muted-foreground max-w-md">
            You've used all 3 of your free AI scans for today. Your limit will reset automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
          <Clock className="size-4" />
          <span>Resets {resetTime}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/manual">
              <FileText className="size-4 mr-2" />
              Enter Manually Instead
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t w-full">
          <p className="text-xs text-muted-foreground">
            Free users get 3 AI scans per day. Upgrade to Pro for unlimited scans.
          </p>
        </div>
      </div>
    </Card>
  );
}

