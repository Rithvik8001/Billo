"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { GroupCard } from "@/components/groups/group-card";
import { GroupDetailSheet } from "@/components/groups/group-detail-sheet";
import { toast } from "sonner";
import type { Group } from "@/lib/assignment-types";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  // Update selected group when groups list updates
  useEffect(() => {
    if (selectedGroup) {
      const updatedGroup = groups.find((g) => g.id === selectedGroup.id);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
      }
    }
  }, [groups]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/groups");
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setDetailSheetOpen(true);
  };

  const handleGroupUpdated = () => {
    fetchGroups();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Groups
          </h1>
          <p className="text-lg text-muted-foreground/70">
            Manage your groups and split bills with others
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Create Group
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center">
          <Users className="size-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No groups yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first group to start splitting bills with others
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Create Your First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => handleGroupClick(group)}
            />
          ))}
        </div>
      )}

      <CreateGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleGroupUpdated}
      />

      <GroupDetailSheet
        group={selectedGroup}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onGroupUpdated={handleGroupUpdated}
      />
    </div>
  );
}

