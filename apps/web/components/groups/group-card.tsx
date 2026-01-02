"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import type { Group } from "@/lib/assignment-types";
import { GroupBalancePreview } from "./group-balance-preview";

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const { user } = useUser();

  return (
    <Card
      className="cursor-pointer interactive"
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl shrink-0">{group.emoji}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-heading-2 mb-1">{group.name}</h3>
            {group.description && (
              <p className="text-small text-muted-foreground line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-small text-muted-foreground">
            <Users className="size-4" />
            <span>
              {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
          {user?.id && (
            <div className="flex items-center justify-between">
              <GroupBalancePreview groupId={group.id} currentUserId={user.id} />
              <span className="text-small text-muted-foreground">View →</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
