"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GroupMember } from "@/lib/assignment-types";

interface ReceiptItem {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface ItemAssignmentGridProps {
  items: ReceiptItem[];
  members: GroupMember[];
  assignments: Map<string, Set<string>>;
  onToggleAssignment: (itemId: string, userId: string) => void;
  onSplitEvenly: () => void;
}

export function ItemAssignmentGrid({
  items,
  members,
  assignments,
  onToggleAssignment,
  onSplitEvenly,
}: ItemAssignmentGridProps) {
  if (members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assign Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a group first to start assigning items
          </p>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assign Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No items found on this receipt
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assign Items</CardTitle>
          <Button variant="outline" size="sm" onClick={onSplitEvenly}>
            Split Evenly
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Click on people to assign items
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const assignedUsers = assignments.get(item.id) || new Set();

            return (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.quantity !== "1" && (
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    )}
                  </div>
                  <p className="ml-4 font-semibold">${item.totalPrice}</p>
                </div>

                {/* Person badges */}
                <div className="flex flex-wrap gap-2">
                  {members.map((member) => {
                    const isAssigned = assignedUsers.has(member.userId);
                    return (
                      <Badge
                        key={member.userId}
                        variant={isAssigned ? "default" : "outline"}
                        className="cursor-pointer select-none transition-all hover:scale-105"
                        onClick={() =>
                          onToggleAssignment(item.id, member.userId)
                        }
                      >
                        {member.imageUrl && (
                          <img
                            src={member.imageUrl}
                            alt={member.name || member.email}
                            className="mr-1 size-3 rounded-full"
                          />
                        )}
                        {member.name || member.email.split("@")[0]}
                      </Badge>
                    );
                  })}
                </div>

                {/* Assignment info */}
                {assignedUsers.size > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {assignedUsers.size} {assignedUsers.size === 1 ? "person" : "people"} assigned · $
                    {(parseFloat(item.totalPrice) / assignedUsers.size).toFixed(2)} each
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
