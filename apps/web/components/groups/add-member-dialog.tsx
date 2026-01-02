"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onSuccess: () => void;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}: AddMemberDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedUserId(null);
      setUsers([]);
    }
  }, [open]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setUsers([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/users/search?email=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add member");
      }

      toast.success("Member added successfully");
      setSelectedUserId(null);
      setSearchQuery("");
      setUsers([]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add member"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Search for a user by email to add them to this group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-search">Search by Email</Label>
            <Combobox
              value={selectedUserId || ""}
              onValueChange={(value) => {
                if (!value) {
                  setSelectedUserId(null);
                  setSearchQuery("");
                } else {
                  setSelectedUserId(value);
                }
              }}
            >
              <ComboboxInput
                id="user-search"
                placeholder="Type email to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                showTrigger
                showClear={!!selectedUserId}
              />
              <ComboboxContent>
                <ComboboxList>
                  {isSearching ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : users.length === 0 && searchQuery.length >= 2 ? (
                    <ComboboxEmpty>No users found</ComboboxEmpty>
                  ) : (
                    users.map((user) => (
                      <ComboboxItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          {user.imageUrl && (
                            <Image
                              src={user.imageUrl}
                              alt={user.name || user.email}
                              width={20}
                              height={20}
                              className="size-5 rounded-full"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.name || user.email.split("@")[0]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </ComboboxItem>
                    ))
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {selectedUser && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium mb-1">Selected:</p>
              <div className="flex items-center gap-2">
                {selectedUser.imageUrl && (
                  <Image
                    src={selectedUser.imageUrl}
                    alt={selectedUser.name || selectedUser.email}
                    width={24}
                    height={24}
                    className="size-6 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {selectedUser.name || selectedUser.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={!selectedUserId || isAdding}
          >
            {isAdding ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
