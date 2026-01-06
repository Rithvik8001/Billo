import { useState } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { Text } from "@/components/ui/Text";
import { colors, spacing, borderRadius, shadows } from "@/constants/theme";
import { MoreVertical, UserMinus, Shield, User } from "lucide-react-native";
import { useGroupsService } from "@/lib/groups-service";
import type { GroupMember } from "@/types/groups";
import { Image } from "expo-image";
import { DeleteMemberAlert } from "./DeleteMemberAlert";

interface MemberRowProps {
  member: GroupMember;
  groupId: string;
  isAdmin: boolean;
  currentUserId: string;
  onRemoved: () => void;
  onRoleChanged: () => void;
}

export function MemberRow({
  member,
  groupId,
  isAdmin,
  currentUserId,
  onRemoved,
  onRoleChanged,
}: MemberRowProps) {
  const groupsService = useGroupsService();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleRemoveMember = async () => {
    setIsRemoving(true);
    try {
      await groupsService.removeMember(groupId, member.userId);
      setDeleteDialogOpen(false);
      onRemoved();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove member";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleChangeRole = async (newRole: "admin" | "member") => {
    if (newRole === member.role) return;

    setIsChangingRole(true);
    try {
      await groupsService.updateMemberRole(groupId, member.userId, newRole);
      onRoleChanged();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change role";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsChangingRole(false);
    }
  };

  const isCurrentUser = member.userId === currentUserId;
  const canEdit = isAdmin && !isCurrentUser;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.memberInfo}>
          {member.imageUrl ? (
            <Image
              source={{ uri: member.imageUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={20} color={colors.mutedForeground} />
            </View>
          )}
          <View style={styles.memberDetails}>
            <Text variant="body" color="foreground" style={styles.memberName}>
              {member.name || member.email.split("@")[0]}
            </Text>
            <Text variant="small" color="muted" style={styles.memberEmail}>
              {member.email}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.badge,
            member.role === "admin"
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.muted },
          ]}
        >
          {member.role === "admin" ? (
            <>
              <Shield size={12} color={colors.primaryForeground} />
              <Text
                variant="small"
                color="primaryForeground"
                style={styles.badgeText}
              >
                Admin
              </Text>
            </>
          ) : (
            <>
              <User size={12} color={colors.mutedForeground} />
              <Text variant="small" color="muted" style={styles.badgeText}>
                Member
              </Text>
            </>
          )}
        </View>
        {canEdit && (
          <View style={styles.menuContainer}>
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              accessibilityLabel="Member options"
              accessibilityRole="button"
            >
              <MoreVertical size={20} color={colors.foreground} />
            </Pressable>
            {showMenu && (
              <View style={styles.menu}>
                {member.role === "admin" ? (
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      handleChangeRole("member");
                      setShowMenu(false);
                    }}
                    disabled={isChangingRole}
                  >
                    <User size={16} color={colors.foreground} />
                    <Text
                      variant="body"
                      color="foreground"
                      style={styles.menuItemText}
                    >
                      Make Member
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      handleChangeRole("admin");
                      setShowMenu(false);
                    }}
                    disabled={isChangingRole}
                  >
                    <Shield size={16} color={colors.foreground} />
                    <Text
                      variant="body"
                      color="foreground"
                      style={styles.menuItemText}
                    >
                      Make Admin
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  style={[styles.menuItem, styles.menuItemDanger]}
                  onPress={() => {
                    setDeleteDialogOpen(true);
                    setShowMenu(false);
                  }}
                >
                  <UserMinus size={16} color={colors.destructive} />
                  <Text
                    variant="body"
                    color="destructive"
                    style={styles.menuItemText}
                  >
                    Remove
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      <DeleteMemberAlert
        visible={deleteDialogOpen}
        memberName={member.name || member.email}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleRemoveMember}
        isRemoving={isRemoving}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontWeight: "500",
    marginBottom: spacing.xs / 2,
  },
  memberEmail: {
    fontSize: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  badgeText: {
    marginLeft: spacing.xs / 2,
  },
  menuContainer: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    top: 32,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 160,
    ...shadows.lg,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    marginLeft: spacing.sm,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
});
