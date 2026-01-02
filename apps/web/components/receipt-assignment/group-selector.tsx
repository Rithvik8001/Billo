"use client";

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import type { Group } from "@/lib/assignment-types";

interface GroupSelectorProps {
  selectedGroupId: number | null;
  onGroupSelect: (groupId: number) => void;
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
        className="mb-2 block text-sm font-medium"
      >
        Select Group
      </label>
      <Combobox
        value={selectedGroupId?.toString() || ""}
        onValueChange={(value) => {
          if (value) {
            onGroupSelect(parseInt(value, 10));
          }
        }}
      >
        <ComboboxInput
          id="group-selector"
          placeholder="Choose a group..."
          showTrigger
          showClear={!!selectedGroupId}
        />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No groups found</ComboboxEmpty>
            {groups.map((group) => (
              <ComboboxItem key={group.id} value={group.id.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{group.name}</span>
                  {group.description && (
                    <span className="text-xs text-muted-foreground">
                      {group.description}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {selectedGroup && (
        <p className="mt-2 text-xs text-muted-foreground">
          Selected: {selectedGroup.name} ({selectedGroup.memberCount} member
          {selectedGroup.memberCount !== 1 ? "s" : ""})
        </p>
      )}
    </div>
  );
}
