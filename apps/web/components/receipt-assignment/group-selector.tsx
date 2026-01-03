"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Group } from "@/lib/assignment-types";

interface GroupSelectorProps {
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string) => void;
}

export function GroupSelector({
  selectedGroupId,
  onGroupSelect,
}: GroupSelectorProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGroups() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/groups");

        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }

        const data = await response.json();
        setGroups(data.groups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load groups");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading groups...</div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center">
        <p className="text-sm font-medium">No groups found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create a group first to split bills with others
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="group-selector"
        className="mb-2 block text-small font-medium"
      >
        Select Group
      </label>
      <Select
        value={selectedGroupId || ""}
        onValueChange={(value) => {
          if (value) {
            onGroupSelect(value);
          }
        }}
      >
        <SelectTrigger id="group-selector" className="w-full">
          <SelectValue placeholder="Choose a group...">
            {selectedGroup ? (
              <span className="flex items-center gap-2">
                <span>{selectedGroup.emoji}</span>
                <span>{selectedGroup.name}</span>
              </span>
            ) : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">{group.emoji}</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{group.name}</span>
                  {group.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {group.description}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedGroup && (
        <p className="mt-2 text-small text-muted-foreground">
          Selected: {selectedGroup.name} ({selectedGroup.memberCount} member
          {selectedGroup.memberCount !== 1 ? "s" : ""})
        </p>
      )}
    </div>
  );
}
