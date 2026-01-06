import { useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Text } from "@/components/ui/Text";
import { ActivityItem } from "@/components/dashboard";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Activity, Clock } from "lucide-react-native";
import { Pressable } from "react-native";

type ActivityFilter =
  | "all"
  | "settlements"
  | "receipts"
  | "groups"
  | "payments";

interface ActivityFilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function ActivityFilterChip({
  label,
  active,
  onPress,
}: ActivityFilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterChip, active && styles.filterChipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        variant="small"
        color={active ? "primaryForeground" : "foreground"}
        style={styles.filterChipText}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ActivityTab() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");
  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  // Mock data - will be replaced with API calls later
  const activities: any[] = [];

  const filters: { key: ActivityFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "settlements", label: "Settlements" },
    { key: "receipts", label: "Receipts" },
    { key: "groups", label: "Groups" },
    { key: "payments", label: "Payments" },
  ];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Activity size={64} color={colors.mutedForeground} />
      <Text variant="h3" color="foreground" style={styles.emptyTitle}>
        No activity yet
      </Text>
      <Text variant="body" color="muted" style={styles.emptyDescription}>
        Start by scanning a receipt or creating a group
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text variant="h2" color="foreground">
          Activity
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}
      >
        {filters.map((filter) => (
          <ActivityFilterChip
            key={filter.key}
            label={filter.label}
            active={activeFilter === filter.key}
            onPress={() => setActiveFilter(filter.key)}
          />
        ))}
      </ScrollView>

      {/* Activity Feed */}
      {activities.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={activities}
          renderItem={({ item }) => <ActivityItem {...item} />}
          keyExtractor={(item, index) => `activity-${index}`}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  filtersScroll: {
    marginBottom: spacing.md,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.iconBackground,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontWeight: "500",
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
  },
});
