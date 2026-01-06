import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { colors, spacing, borderRadius } from "@/constants/theme";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react-native";
import { useGroupsService } from "@/lib/groups-service";
import { useUser } from "@clerk/clerk-expo";
import type { Group, GroupMember } from "@/types/groups";
import { MemberRow } from "@/components/groups/MemberRow";
import { AddMemberSheet } from "@/components/groups/AddMemberSheet";
import { EditGroupSheet } from "@/components/groups/EditGroupSheet";
import { DeleteGroupAlert } from "@/components/groups/DeleteGroupAlert";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const groupsService = useGroupsService();
  const serviceRef = useRef(groupsService);
  serviceRef.current = groupsService;

  const { user } = useUser();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<"admin" | "member">(
    "member"
  );

  useEffect(() => {
    if (id && user?.id) {
      fetchGroupAndMembers();
    }
  }, [id, user?.id]);

  const fetchGroupAndMembers = async () => {
    if (!id || !user?.id) return;

    setIsLoading(true);
    try {
      const [groupResponse, membersResponse] = await Promise.all([
        serviceRef.current.fetchGroup(id),
        serviceRef.current.fetchMembers(id),
      ]);

      setGroup(groupResponse.group);
      setMembers(membersResponse.members || []);

      const currentMember = membersResponse.members?.find(
        (m: GroupMember) => m.userId === user.id
      );
      if (currentMember) {
        setCurrentUserRole(currentMember.role);
      } else {
        setCurrentUserRole("member");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchGroupAndMembers();
    setRefreshing(false);
  };

  const handleDeleteGroup = async () => {
    if (!group) return;

    setIsDeleting(true);
    try {
      await serviceRef.current.deleteGroup(group.id);
      setDeleteDialogOpen(false);
      router.back();
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMemberAdded = () => {
    fetchGroupAndMembers();
    setAddMemberOpen(false);
  };

  const handleMemberRemoved = () => {
    fetchGroupAndMembers();
  };

  const handleMemberRoleChanged = () => {
    fetchGroupAndMembers();
  };

  const handleGroupUpdated = () => {
    setEditGroupOpen(false);
    fetchGroupAndMembers();
  };

  if (isLoading && !group) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text variant="h3" color="foreground">
            Group not found
          </Text>
          <Button
            variant="outline"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isAdmin = currentUserRole === "admin";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>

        <View style={styles.headerTitle}>
          <Text style={styles.emoji}>{group.emoji}</Text>
          <View style={styles.titleContainer}>
            <Text variant="h3" color="foreground" numberOfLines={1}>
              {group.name}
            </Text>
            {group.description && (
              <Text variant="small" color="muted" numberOfLines={1}>
                {group.description}
              </Text>
            )}
          </View>
        </View>

        {isAdmin && (
          <View style={styles.menuContainer}>
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              accessibilityLabel="Group options"
              accessibilityRole="button"
            >
              <MoreVertical size={24} color={colors.foreground} />
            </Pressable>
            {showMenu && (
              <View style={styles.menu}>
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setEditGroupOpen(true);
                    setShowMenu(false);
                  }}
                >
                  <Edit size={16} color={colors.foreground} />
                  <Text
                    variant="body"
                    color="foreground"
                    style={styles.menuItemText}
                  >
                    Edit Group
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.menuItem, styles.menuItemDanger]}
                  onPress={() => {
                    setDeleteDialogOpen(true);
                    setShowMenu(false);
                  }}
                >
                  <Trash2 size={16} color={colors.destructive} />
                  <Text
                    variant="body"
                    color="destructive"
                    style={styles.menuItemText}
                  >
                    Delete Group
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberRow
            key={item.userId}
            member={item}
            groupId={group.id}
            isAdmin={isAdmin}
            currentUserId={user?.id || ""}
            onRemoved={handleMemberRemoved}
            onRoleChanged={handleMemberRoleChanged}
          />
        )}
        keyExtractor={(item) => item.userId}
        ListHeaderComponent={
          <View style={styles.membersHeader}>
            <Text variant="h3" color="foreground">
              Members{" "}
              <Text variant="body" color="muted">
                ({members.length})
              </Text>
            </Text>
            {isAdmin && (
              <Button
                variant="default"
                size="sm"
                onPress={() => setAddMemberOpen(true)}
                icon={<Plus size={16} color={colors.primaryForeground} />}
              >
                Add
              </Button>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" color="muted">
              No members yet. Add your first member to get started.
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />

      <AddMemberSheet
        visible={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        groupId={group.id}
        onSuccess={handleMemberAdded}
      />

      <EditGroupSheet
        visible={editGroupOpen}
        onClose={() => setEditGroupOpen(false)}
        group={group}
        onSuccess={handleGroupUpdated}
      />

      <DeleteGroupAlert
        visible={deleteDialogOpen}
        groupName={group.name}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteGroup}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  menuContainer: {
    position: "relative",
    marginLeft: spacing.sm,
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
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
});
