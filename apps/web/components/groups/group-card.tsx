"use client";

import Link from "next/link";
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
      className="cursor-pointer transition-colors hover:bg-[#F9FAFB]"
      onClick={onClick}
    >
      <CardContent className="pt-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-2xl shrink-0">{group.emoji}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-h3 mb-1">{group.name}</h3>
            {group.description && (
              <p className="text-small text-muted-foreground line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-small text-muted-foreground">
            <Users className="size-3.5 shrink-0 opacity-60" />
            <span>
              {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
          {user?.id && (
            <div className="flex items-center justify-between gap-2">
              <GroupBalancePreview groupId={group.id} currentUserId={user.id} />
              <Link
                href={`/dashboard/settle?groupId=${group.id}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View →
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
