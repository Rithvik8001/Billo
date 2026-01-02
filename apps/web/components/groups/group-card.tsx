"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Group } from "@/lib/assignment-types";

interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{group.name}</CardTitle>
        {group.description && (
          <CardDescription className="line-clamp-2">
            {group.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>
            {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
