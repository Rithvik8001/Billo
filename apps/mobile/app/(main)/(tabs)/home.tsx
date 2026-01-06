import { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
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
  ArrowRight,
  CheckCircle,
  Activity,
} from "lucide-react-native";
import { Button } from "@/components/ui/Button";
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
        <View style={styles.balanceSection}>
          <BalanceCard
            label="You Owe"
            amount={balanceData.youOwe}
            subtitle={`${balanceData.youOweCount} pending settlement${
              balanceData.youOweCount !== 1 ? "s" : ""
            }`}
            variant="owe"
          />
          <View style={styles.balanceGap} />
          <BalanceCard
            label="Owed to You"
            amount={balanceData.owedToYou}
            subtitle={`${balanceData.owedToYouCount} pending settlement${
              balanceData.owedToYouCount !== 1 ? "s" : ""
            }`}
            variant="owed"
          />
          <View style={styles.balanceGap} />
          <BalanceCard
            label="Net Balance"
            amount={balanceData.netBalance}
            subtitle="Total balance"
            variant="net"
          />
        </View>

        <View style={styles.section}>
          <Text variant="h3" color="foreground" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon={Camera}
              label="Scan Receipt"
              onPress={() => {
                // Navigate to scan screen later
              }}
            />
            <QuickActionCard
              icon={Users}
              label="Groups"
              onPress={() => {
                router.push("/(main)/(tabs)/groups");
              }}
            />
            <QuickActionCard
              icon={Receipt}
              label="Receipts"
              onPress={() => {
                // Navigate to receipts later
              }}
            />
            <QuickActionCard
              icon={Wallet}
              label="Settle Up"
              onPress={() => {
                // Navigate to settlements later
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" color="foreground" style={styles.sectionTitle}>
              Recent Activity
            </Text>
            {recentActivity.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  router.push("/(main)/(tabs)/activity");
                }}
                icon={<ArrowRight size={16} color={colors.foreground} />}
                iconPosition="right"
              >
                View All
              </Button>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  balanceSection: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  balanceGap: {
    height: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  actionsGrid: {
    gap: spacing.md,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
