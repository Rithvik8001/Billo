import { useState, useMemo } from "react";
import { View, StyleSheet, SectionList, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { ActivityItem } from "@/components/dashboard";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Button } from "@/components/ui/Button";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Activity, Wallet, Receipt, CheckCircle, Users, Camera } from "lucide-react-native";
import { useActivity, type ActivityFilter, type ActivitySection } from "@/hooks/useActivity";
import type { ActivityItem as ActivityItemType } from "@/types/activity";

// Simplified filter type for tabs (combine settlements + payments into "settlements")
type TabFilter = "all" | "settlements" | "receipts";

// Map tab filter to activity filter
function mapTabToActivityFilter(tabFilter: TabFilter): ActivityFilter {
  switch (tabFilter) {
    case "settlements":
      return "settlements"; // Will filter both settlements and payments
    case "receipts":
      return "receipts";
    default:
      return "all";
  }
}

// Map activity type to icon and color
function getActivityIconConfig(type: ActivityItemType["type"]) {
  switch (type) {
    case "settlement":
      return { icon: Wallet, color: "destructive" as const };
    case "receipt":
      return { icon: Receipt, color: "accent" as const };
    case "payment":
      return { icon: CheckCircle, color: "success" as const };
    case "group":
      return { icon: Users, color: "foreground" as const };
    default:
      return { icon: Activity, color: "foreground" as const };
  }
}

// Map amount type to color
function getAmountColor(amountType?: ActivityItemType["amountType"]): "foreground" | "destructive" | "success" | "muted" {
  switch (amountType) {
    case "owe":
      return "destructive";
    case "owed":
      return "success";
    default:
      return "foreground";
  }
}

export default function ActivityTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const { activities, isLoading, error, refreshing, refresh, getGroupedActivities } = useActivity();
  
  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  const tabs: Array<{ key: TabFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "settlements", label: "Settlements" },
    { key: "receipts", label: "Receipts" },
  ];

  // Get filtered and grouped activities
  const groupedActivities = useMemo(() => {
    const activityFilter = mapTabToActivityFilter(activeTab);
    
    if (activeTab === "settlements") {
      // Filter for both settlements and payments
      const filtered = activities.filter(
        (item) => item.type === "settlement" || item.type === "payment"
      );
      // Group by date
      const sections: ActivitySection[] = [];
      const today: ActivityItem[] = [];
      const yesterday: ActivityItem[] = [];
      const thisWeek: ActivityItem[] = [];
      const earlier: ActivityItem[] = [];
      
      const now = new Date();
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const weekAgo = new Date(todayDate);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      filtered.forEach((activity) => {
        const activityDate = new Date(activity.rawTimestamp);
        if (activityDate >= todayDate) {
          today.push(activity);
        } else if (activityDate >= yesterdayDate) {
          yesterday.push(activity);
        } else if (activityDate >= weekAgo) {
          thisWeek.push(activity);
        } else {
          earlier.push(activity);
        }
      });
      
      if (today.length > 0) sections.push({ title: "Today", data: today });
      if (yesterday.length > 0) sections.push({ title: "Yesterday", data: yesterday });
      if (thisWeek.length > 0) sections.push({ title: "This Week", data: thisWeek });
      if (earlier.length > 0) sections.push({ title: "Earlier", data: earlier });
      
      return sections;
    }
    
    return getGroupedActivities(activityFilter);
  }, [activities, activeTab, getGroupedActivities]);

  const renderEmptyState = () => {
    const tabLabel = tabs.find((t) => t.key === activeTab)?.label.toLowerCase() || "activity";
    
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Activity size={80} color={colors.mutedForeground} />
        </View>
        <Text variant="h2" color="foreground" style={styles.emptyTitle}>
          {activeTab === "all" ? "No activity yet" : `No ${tabLabel} yet`}
        </Text>
        <Text variant="body" color="muted" style={styles.emptyDescription}>
          {activeTab === "all"
            ? "Start by scanning a receipt or creating a group"
            : `No ${tabLabel} to show`}
        </Text>
        {activeTab === "all" && (
          <Button
            variant="default"
            size="lg"
            onPress={() => {
              // Navigate to scan screen when implemented
            }}
            icon={<Camera size={20} color={colors.primaryForeground} />}
            style={styles.emptyActionButton}
          >
            Scan a Receipt
          </Button>
        )}
      </View>
    );
  };

  const handleActivityPress = (item: ActivityItemType) => {
    if (item.type === "receipt" && item.metadata.receiptId) {
      router.push(`/receipt/${item.metadata.receiptId}`);
    } else if ((item.type === "settlement" || item.type === "payment") && item.metadata.settlementId) {
      router.push(`/settlement/${item.metadata.settlementId}`);
    } else if (item.type === "group" && item.metadata.groupId) {
      router.push(`/group/${item.metadata.groupId}`);
    }
  };

  const renderActivityItem = ({ item }: { item: ActivityItemType }) => {
    const { icon, color } = getActivityIconConfig(item.type);
    const amountColor = getAmountColor(item.amountType);
    
    return (
      <ActivityItem
        icon={icon}
        iconColor={color}
        title={item.title}
        description={item.description}
        timestamp={item.timestamp}
        amount={item.amount}
        amountColor={amountColor}
        onPress={() => handleActivityPress(item)}
      />
    );
  };

  const renderSectionHeader = ({ section }: { section: ActivitySection }) => (
    <View style={styles.sectionHeader}>
      <Text variant="caption" color="muted">
        {section.title.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text variant="h1" color="foreground">
          Activity
        </Text>
      </View>

      {/* Segmented Tabs */}
      <SegmentedTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Activity Feed */}
      {isLoading && groupedActivities.length === 0 ? (
        <View style={styles.loadingState}>
          <Text variant="body" color="muted">
            Loading activity...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Activity size={80} color={colors.mutedForeground} />
          </View>
          <Text variant="h2" color="foreground" style={styles.emptyTitle}>
            Error loading activity
          </Text>
          <Text variant="body" color="muted" style={styles.emptyDescription}>
            {error}
          </Text>
        </View>
      ) : groupedActivities.length === 0 ? (
        renderEmptyState()
      ) : (
        <SectionList
          sections={groupedActivities}
          renderItem={renderActivityItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.foreground}
            />
          }
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
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.full,
    backgroundColor: colors.iconBackgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyDescription: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyActionButton: {
    marginTop: spacing.md,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
