"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function EmailPreferencesSection() {
  const [preferences, setPreferences] = useState({
    emailGroupInvites: true,
    emailSettlements: true,
    emailPayments: true,
    emailWeeklySummary: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/users/preferences/email");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error("Error fetching email preferences:", error);
      toast.error("Failed to load email preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = async (
    key: keyof typeof preferences,
    value: boolean
  ) => {
    try {
      const response = await fetch("/api/users/preferences/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setPreferences((prev) => ({ ...prev, [key]: value }));
      toast.success("Email preference updated");
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Failed to update preference");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Choose which email notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="group-invites">Group Invitations</Label>
            <p className="text-sm text-muted-foreground">
              When you're added to a group
            </p>
          </div>
          <Switch
            id="group-invites"
            checked={preferences.emailGroupInvites}
            onCheckedChange={(checked) =>
              updatePreference("emailGroupInvites", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="settlements">New Settlements</Label>
            <p className="text-sm text-muted-foreground">
              When you owe or are owed money
            </p>
          </div>
          <Switch
            id="settlements"
            checked={preferences.emailSettlements}
            onCheckedChange={(checked) =>
              updatePreference("emailSettlements", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="payments">Payment Confirmations</Label>
            <p className="text-sm text-muted-foreground">
              When settlements are marked as paid
            </p>
          </div>
          <Switch
            id="payments"
            checked={preferences.emailPayments}
            onCheckedChange={(checked) =>
              updatePreference("emailPayments", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-summary">Weekly Summary</Label>
            <p className="text-sm text-muted-foreground">
              Monday digest of pending settlements
            </p>
          </div>
          <Switch
            id="weekly-summary"
            checked={preferences.emailWeeklySummary}
            onCheckedChange={(checked) =>
              updatePreference("emailWeeklySummary", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
