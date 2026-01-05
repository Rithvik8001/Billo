"use client";

import { ManualEntryWizard } from "@/components/manual-entry/manual-entry-wizard";

export default function ManualEntryPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-1">
        <h1 className="text-h1">Manual Entry</h1>
        <p className="text-body text-muted-foreground">
          Enter bill details manually when you don&apos;t have a receipt to scan
        </p>
      </div>

      <ManualEntryWizard />
    </div>
  );
}
