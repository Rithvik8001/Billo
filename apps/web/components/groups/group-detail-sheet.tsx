"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMemberSheet } from "./add-member-sheet";
import { EditGroupDialog } from "./edit-group-dialog";
import { MemberRow } from "./member-row";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import type { Group } from "@/lib/assignment-types";
import type { GroupMember } from "@/lib/assignment-types";

interface GroupDetailSheetProps {
  group: Group | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupUpdated: () => void;
}

export function GroupDetailSheet({
  group,
  open,
  onOpenChange,
  onGroupUpdated,
}: GroupDetailSheetProps) {
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "member">(
    "member"
  );

  useEffect(() => {
    if (open && group && user?.id) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group, user?.id]);

  const fetchMembers = async () => {
    if (!group || !user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${group.id}/members`);
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data.members || []);

      // Find current user's role
      const currentMember = data.members?.find(
        (m: GroupMember) => m.userId === user.id
      );
      if (currentMember) {
        setCurrentUserRole(currentMember.role);
      } else {
        setCurrentUserRole("member");
      }
    } catch {
      toast.error("Failed to load members");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete group");
      }

      toast.success("Group deleted successfully");
      setDeleteDialogOpen(false);
      onOpenChange(false);
      onGroupUpdated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete group"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMemberAdded = () => {
    fetchMembers();
    setAddMemberOpen(false);
  };

  const handleMemberRemoved = () => {
    fetchMembers();
  };

  const handleMemberRoleChanged = () => {
    fetchMembers();
  };

  const handleGroupUpdated = () => {
    setEditGroupOpen(false);
    onGroupUpdated();
    fetchMembers();
  };

  if (!group) return null;

  const isAdmin = currentUserRole === "admin";

  const headerContent = (
    <div className="flex items-start justify-between gap-3 pr-8">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="text-3xl shrink-0 leading-none mt-0.5">{group.emoji}</div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold leading-tight tracking-tight">
            {group.name}
          </h2>
          {group.description && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {group.description}
            </p>
          )}
        </div>
      </div>
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreVertical className="size-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setEditGroupOpen(true)}>
              <Edit className="size-4 mr-2" />
              Edit Group
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              variant="destructive"
            >
              <Trash2 className="size-4 mr-2" />
              Delete Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  const bodyContent = (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">
          Members{" "}
          <span className="text-muted-foreground font-normal">
            ({members.length})
          </span>
        </h3>
        {isAdmin && (
          <Button
            size="sm"
            onClick={() => setAddMemberOpen(true)}
            className="gap-1.5 shrink-0"
          >
            <Plus className="size-4" />
            Add Member
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="text-sm text-muted-foreground">
            Loading members...
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="py-8 text-center">
          <div className="text-sm text-muted-foreground">
            No members yet. Add your first member to get started.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <MemberRow
              key={member.userId}
              member={member}
              groupId={group.id}
              isAdmin={isAdmin}
              onRemoved={handleMemberRemoved}
              onRoleChanged={handleMemberRoleChanged}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[85vh] flex flex-col">
            <DrawerHeader className="text-left pb-0">
              <DrawerTitle className="sr-only">{group.name}</DrawerTitle>
              <DrawerDescription className="sr-only">
                {group.description || "Group details"}
              </DrawerDescription>
              {headerContent}
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto flex-1">
              {bodyContent}
            </div>
          </DrawerContent>
        </Drawer>

        <AddMemberSheet
          open={addMemberOpen}
          onOpenChange={setAddMemberOpen}
          groupId={group.id}
          onSuccess={handleMemberAdded}
        />

        <EditGroupDialog
          open={editGroupOpen}
          onOpenChange={setEditGroupOpen}
          group={group}
          onSuccess={handleGroupUpdated}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{group.name}&quot;? This
                action cannot be undone and will remove all members from this
                group.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGroup}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-4">
          <SheetHeader className="pb-0 p-0">
            <SheetTitle className="sr-only">{group.name}</SheetTitle>
            <SheetDescription className="sr-only">
              {group.description || "Group details"}
            </SheetDescription>
            {headerContent}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto -mx-1">
            {bodyContent}
          </div>
        </SheetContent>
      </Sheet>

      <AddMemberSheet
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        groupId={group.id}
        onSuccess={handleMemberAdded}
      />

      <EditGroupDialog
        open={editGroupOpen}
        onOpenChange={setEditGroupOpen}
        group={group}
        onSuccess={handleGroupUpdated}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{group.name}&quot;? This
              action cannot be undone and will remove all members from this
              group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
