"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { useCurrency } from "@/contexts/currency-context";
import { EmailPreferencesSection } from "@/components/settings/email-preferences-section";
import { SubscriptionSection } from "@/components/subscription/subscription-section";
import { toast } from "sonner";

interface SettingsClientProps {
  initialCurrency: string;
}

export function SettingsClient({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialCurrency: _initialCurrency,
}: SettingsClientProps) {
  const { currency, setCurrency, formatAmount } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();

  // Handle checkout success redirect
  useEffect(() => {
    if (searchParams.get("checkout_success") === "true") {
      toast.success("Welcome to Billo Pro!", {
        description: "Your subscription is now active. Enjoy 50 scans per day!",
      });
      // Clean up URL
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (selectedCurrency === currency) {
      return;
    }

    setIsSaving(true);
    try {
      await setCurrency(selectedCurrency);
    } catch {
      // Error handling is done in the context
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-1">
        <h1 className="text-h1">Settings</h1>
        <p className="text-body text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <SubscriptionSection />

      <Card>
        <CardHeader>
          <CardTitle>Currency Preference</CardTitle>
          <CardDescription>
            Choose your preferred currency for displaying amounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled={isSaving}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <p className="text-small text-muted-foreground mb-2">Preview:</p>
            <p className="text-body font-semibold">{formatAmount("1234.56")}</p>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || selectedCurrency === currency}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmailPreferencesSection />
    </div>
  );
}
