"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Group } from "@/lib/assignment-types";

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  onSuccess: () => void;
}

export function EditGroupDialog({
  open,
  onOpenChange,
  group,
  onSuccess,
}: EditGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && group) {
      setName(group.name);
      setDescription(group.description || "");
    }
  }, [open, group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update group");
      }

      toast.success("Group updated successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update group"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Update the group name and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name">Group Name *</Label>
              <Input
                id="edit-group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Roommates, Family Trip"
                maxLength={100}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-group-description">
                Description (optional)
              </Label>
              <Textarea
                id="edit-group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this group..."
                maxLength={500}
                rows={3}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
