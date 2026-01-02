"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, UserMinus, Shield, User } from "lucide-react";
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
import { toast } from "sonner";
import type { GroupMember } from "@/lib/assignment-types";
import Image from "next/image";

interface MemberRowProps {
  member: GroupMember;
  groupId: number;
  isAdmin: boolean;
  onRemoved: () => void;
  onRoleChanged: () => void;
}

export function MemberRow({
  member,
  groupId,
  isAdmin,
  onRemoved,
  onRoleChanged,
}: MemberRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const handleRemoveMember = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch(
        `/api/groups/${groupId}/members/${member.userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove member");
      }

      toast.success("Member removed successfully");
      setDeleteDialogOpen(false);
      onRemoved();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove member"
      );
    } finally {
      setIsRemoving(false);
    }
  };

  const handleChangeRole = async (newRole: "admin" | "member") => {
    if (newRole === member.role) return;

    setIsChangingRole(true);
    try {
      const response = await fetch(
        `/api/groups/${groupId}/members/${member.userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change role");
      }

      toast.success(`Member role changed to ${newRole}`);
      onRoleChanged();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change role"
      );
    } finally {
      setIsChangingRole(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name || member.email}
              width={40}
              height={40}
              className="size-10 rounded-full shrink-0 ring-1 ring-border"
            />
          ) : (
            <div className="size-10 rounded-full shrink-0 bg-muted flex items-center justify-center ring-1 ring-border">
              <User className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight">
              {member.name || member.email.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {member.email}
            </p>
          </div>
          <Badge
            variant={member.role === "admin" ? "default" : "secondary"}
            className="shrink-0 gap-1"
          >
            {member.role === "admin" ? (
              <>
                <Shield className="size-3" />
                Admin
              </>
            ) : (
              <>
                <User className="size-3" />
                Member
              </>
            )}
          </Badge>
        </div>

        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="shrink-0 -mr-1">
                <MoreVertical className="size-4" />
                <span className="sr-only">Member options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {member.role === "admin" ? (
                <DropdownMenuItem
                  onClick={() => handleChangeRole("member")}
                  disabled={isChangingRole}
                >
                  <User className="size-4 mr-2" />
                  Make Member
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleChangeRole("admin")}
                  disabled={isChangingRole}
                >
                  <Shield className="size-4 mr-2" />
                  Make Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setDeleteDialogOpen(true)}
                variant="destructive"
              >
                <UserMinus className="size-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {member.name || member.email} from
              this group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemoving}
              variant="destructive"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
