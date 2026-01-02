"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  imageUrl: string | null;
}

interface AddMemberSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onSuccess: () => void;
}

export function AddMemberSheet({
  open,
  onOpenChange,
  groupId,
  onSuccess,
}: AddMemberSheetProps) {
  const isMobile = useIsMobile();
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

  const formContent = (
    <>
      <div className="space-y-2">
        <Label htmlFor="user-search" className="text-sm font-medium">
          Search by Email
        </Label>
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
                <div className="px-3 py-2.5 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : users.length === 0 && searchQuery.length >= 2 ? (
                <ComboboxEmpty>No users found</ComboboxEmpty>
              ) : (
                users.map((user) => (
                  <ComboboxItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2.5">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.name || user.email}
                          width={20}
                          height={20}
                          className="size-5 rounded-full shrink-0 ring-1 ring-border"
                        />
                      ) : (
                        <div className="size-5 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
                          <span className="text-xs font-medium text-muted-foreground">
                            {user.email[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-sm truncate leading-tight">
                          {user.name || user.email.split("@")[0]}
                        </span>
                        <span className="text-xs text-muted-foreground truncate mt-0.5">
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
        <div className="mt-4 rounded-lg border bg-card p-4 space-y-3 transition-colors">
          <p className="text-sm font-medium">Selected:</p>
          <div className="flex items-center gap-3">
            {selectedUser.imageUrl ? (
              <Image
                src={selectedUser.imageUrl}
                alt={selectedUser.name || selectedUser.email}
                width={40}
                height={40}
                className="size-10 rounded-full shrink-0 ring-1 ring-border"
              />
            ) : (
              <div className="size-10 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedUser.email[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight">
                {selectedUser.name || selectedUser.email.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {selectedUser.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const footerContent = (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isAdding}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>
      <Button
        onClick={handleAddMember}
        disabled={!selectedUserId || isAdding}
        className="w-full sm:w-auto"
      >
        {isAdding ? "Adding..." : "Add Member"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerHeader className="text-left pb-6">
            <DrawerTitle>Add Member</DrawerTitle>
            <DrawerDescription>
              Search for a user by email to add them to this group.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto flex-1">{formContent}</div>
          <DrawerFooter className="border-t pt-6 pb-4">{footerContent}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-6">
          <SheetTitle>Add Member</SheetTitle>
          <SheetDescription>
            Search for a user by email to add them to this group.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">{formContent}</div>
        <SheetFooter className="border-t pt-6 mt-6 px-6 pb-6">{footerContent}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
