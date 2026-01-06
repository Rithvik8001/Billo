import { useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { GroupCard } from "@/components/dashboard";
import { CreateGroupSheet } from "@/components/groups";
import { useGroups } from "@/hooks/useGroups";
import { colors, spacing } from "@/constants/theme";
import { Users, Plus } from "lucide-react-native";
import type { Group } from "@/types/groups";

export default function GroupsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groups, isLoading, error, refreshing, refresh } = useGroups();
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  const handleCreateSuccess = (groupId: string) => {
    refresh();
  };

  const handleGroupPress = (group: Group) => {
    router.push(`/group/${group.id}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Users size={64} color={colors.mutedForeground} />
      <Text variant="h3" color="foreground" style={styles.emptyTitle}>
        No groups yet
      </Text>
      <Text variant="body" color="muted" style={styles.emptyDescription}>
        Create your first group to split bills
      </Text>
      <Button
        variant="default"
        onPress={() => setCreateSheetVisible(true)}
        icon={<Plus size={20} color={colors.primaryForeground} />}
        style={styles.createButton}
      >
        Create Group
      </Button>
    </View>
  );

  const renderGroupCard = ({ item }: { item: Group }) => (
    <GroupCard
      emoji={item.emoji}
      name={item.name}
      memberCount={item.memberCount}
      onPress={() => handleGroupPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text variant="h2" color="foreground">
              Groups
            </Text>
            <Text variant="body" color="muted" style={styles.subtitle}>
              Manage your groups
            </Text>
          </View>
          <Button
            variant="card"
            onPress={() => setCreateSheetVisible(true)}
            accessibilityLabel="Create group"
          >
            <Plus size={20} color={colors.primaryForeground} />
          </Button>
        </View>
      </View>

      {isLoading && groups.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && groups.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text variant="body" color="destructive" style={styles.errorText}>
            {error}
          </Text>
          <Button
            variant="outline"
            onPress={refresh}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : groups.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroupCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      )}

      <CreateGroupSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
        onSuccess={handleCreateSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subtitle: {
    marginTop: spacing.xs / 2,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
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
  errorText: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.md,
  },
});
