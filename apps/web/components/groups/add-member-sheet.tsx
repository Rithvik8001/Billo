"use client";

import { useState, useEffect, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedUserId(null);
      setSelectedUserData(null);
      setUsers([]);
      setShowResults(false);
    }
  }, [open]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setUsers([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

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
      setShowResults(true);
    } catch {
      toast.error("Failed to search users");
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedUserData(user);
      setShowResults(false);
      setSearchQuery("");
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
      setSelectedUserData(null);
      setSearchQuery("");
      setUsers([]);
      setShowResults(false);
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

  const selectedUser = selectedUserData;

  const formContent = (
    <>
      <div className="space-y-2">
        <Label htmlFor="user-search" className="text-sm font-medium">
          Search by Email
        </Label>
        <div className="relative" ref={searchContainerRef}>
          <div className="relative">
            <Input
              id="user-search"
              type="text"
              placeholder="Type email to search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedUserId) {
                  setSelectedUserId(null);
                  setSelectedUserData(null);
                }
              }}
              onFocus={() => {
                if (users.length > 0) {
                  setShowResults(true);
                }
              }}
              className="pr-8"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedUserId(null);
                  setSelectedUserData(null);
                  setUsers([]);
                  setShowResults(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          {showResults && (
            <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-lg shadow-md ring-1 ring-border max-h-72 overflow-y-auto">
              {isSearching ? (
                <div className="px-3 py-2.5 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : users.length === 0 && searchQuery.length >= 2 ? (
                <div className="px-3 py-2.5 text-sm text-muted-foreground text-center">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user.id)}
                    className="w-full px-3 py-2.5 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
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
                  </button>
                ))
              )}
            </div>
          )}
        </div>
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
          <DrawerFooter className="border-t pt-6 pb-4">
            {footerContent}
          </DrawerFooter>
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
        <SheetFooter className="border-t pt-6 mt-6 px-6 pb-6">
          {footerContent}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
