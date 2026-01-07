import { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Text, MixedText } from "@/components/ui/Text";
import { IconButton } from "@/components/ui/Icon";
import {
  BalanceCard,
  QuickActionCard,
  ActivityItem,
  FloatingActionButton,
  ManualEntrySheet,
} from "@/components/dashboard";
import { colors, spacing } from "@/constants/theme";
import {
  Camera,
  Users,
  Wallet,
  Receipt,
  ChevronRight,
  CheckCircle,
  Activity,
  Plus,
  ArrowDownRight,
} from "lucide-react-native";
import { useActivity } from "@/hooks/useActivity";
import type { ActivityItem as ActivityItemType } from "@/types/activity";

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

export default function HomeTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [manualEntryVisible, setManualEntryVisible] = useState(false);
  const { activities } = useActivity();

  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  // Mock data - will be replaced with API calls later
  const balanceData = {
    youOwe: "$0.00",
    owedToYou: "$0.00",
    netBalance: "$0.00",
    youOweCount: 0,
    owedToYouCount: 0,
  };

  // Get recent activity (limited to 5 items)
  const recentActivity = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  const firstName = user?.firstName || "there";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with welcome and action buttons */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text variant="body" color="muted">Welcome back,</Text>
            <Text variant="h1" color="foreground">{firstName}</Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton
              icon={Plus}
              variant="primary"
              size="sm"
              onPress={() => setManualEntryVisible(true)}
              accessibilityLabel="Add expense"
            />
            <IconButton
              icon={ArrowDownRight}
              variant="outlined"
              size="sm"
              onPress={() => {}}
              accessibilityLabel="Quick actions"
            />
          </View>
        </View>

        {/* Hero Balance Card */}
        <View style={styles.heroSection}>
          <BalanceCard
            label="NET BALANCE"
            amount={balanceData.netBalance}
            subtitle="You're all settled up!"
            variant="hero"
          />
        </View>

        {/* Secondary Balance Cards - Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.balanceScroll}
          contentContainerStyle={styles.balanceScrollContent}
        >
          <View style={styles.balanceCardWrapper}>
            <BalanceCard
              label="YOU OWE"
              amount={balanceData.youOwe}
              subtitle={`${balanceData.youOweCount} pending`}
              variant="owe"
            />
          </View>
          <View style={styles.balanceCardWrapper}>
            <BalanceCard
              label="OWED TO YOU"
              amount={balanceData.owedToYou}
              subtitle={`${balanceData.owedToYouCount} pending`}
              variant="owed"
            />
          </View>
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="foreground">Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon={Camera}
              label="Scan Receipt"
              description="Capture & split"
              onPress={() => {}}
            />
            <QuickActionCard
              icon={Users}
              label="Groups"
              description="Manage your groups"
              onPress={() => router.push("/(main)/(tabs)/groups")}
            />
            <QuickActionCard
              icon={Receipt}
              label="Receipts"
              description="View all receipts"
              onPress={() => {}}
            />
            <QuickActionCard
              icon={Wallet}
              label="Settle Up"
              description="Pay your balances"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="foreground">Recent Activity</Text>
            {recentActivity.length > 0 && (
              <Pressable
                style={styles.seeAllButton}
                onPress={() => router.push("/(main)/(tabs)/activity")}
              >
                <Text variant="small" color="primary" style={styles.seeAllText}>
                  See all
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </Pressable>
            )}
          </View>
          {recentActivity.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="body" color="muted" style={styles.emptyText}>
                No recent activity
              </Text>
            </View>
          ) : (
            <View>
              {recentActivity.map((activity) => {
                const { icon, color } = getActivityIconConfig(activity.type);
                const amountColor = getAmountColor(activity.amountType);

                return (
                  <ActivityItem
                    key={activity.id}
                    icon={icon}
                    iconColor={color}
                    title={activity.title}
                    description={activity.description}
                    timestamp={activity.timestamp}
                    amount={activity.amount}
                    amountColor={amountColor}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <FloatingActionButton onPress={() => setManualEntryVisible(true)} />

      <ManualEntrySheet
        visible={manualEntryVisible}
        onClose={() => setManualEntryVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  heroSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceScroll: {
    marginBottom: spacing.xl,
  },
  balanceScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  balanceCardWrapper: {
    width: 200,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontWeight: "500",
  },
  actionsGrid: {
    gap: spacing.sm,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
