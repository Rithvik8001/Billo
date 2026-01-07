import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { ArrowLeft, Wallet, ArrowDown } from "lucide-react-native";
import { useApiClient } from "@/lib/api-client";
import { useCurrency } from "@/hooks/useCurrency";
import type { Settlement } from "@/types/activity";

type SettlementFilter = "all" | "owing" | "owed";

interface SettlementWithRelations {
  id: string;
  receiptId: string | null;
  groupId: string | null;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  settledAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  fromUser: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  toUser: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  receipt: {
    id: string;
    merchantName: string | null;
    purchaseDate: string | null;
    totalAmount: string | null;
  } | null;
  group: {
    id: string;
    name: string;
    emoji: string | null;
  } | null;
}

interface SettlementsResponse {
  settlements: SettlementWithRelations[];
}

function SettlementCard({
  settlement,
  currentUserId,
  onPress,
}: {
  settlement: SettlementWithRelations;
  currentUserId: string;
  onPress: () => void;
}) {
  const { formatAmount } = useCurrency();
  const isOwing = settlement.fromUserId === currentUserId;
  const otherUser = isOwing ? settlement.toUser : settlement.fromUser;
  const otherUserName = otherUser.name || otherUser.email.split("@")[0];
  const amount = formatAmount(settlement.amount, settlement.currency);

  const contextInfo = settlement.receipt?.merchantName
    ? settlement.receipt.merchantName
    : settlement.group
    ? `${settlement.group.emoji || ""} ${settlement.group.name}`.trim()
    : null;

  return (
    <Card style={styles.settlementCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.userSection}>
          {isOwing ? (
            <>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, styles.currentUserAvatar]}>
                  <Text variant="body" color="primaryForeground">
                    You
                  </Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <ArrowDown size={20} color={colors.mutedForeground} />
              </View>
              <View style={styles.avatarContainer}>
                {otherUser.imageUrl ? (
                  <Image
                    source={{ uri: otherUser.imageUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text variant="body" color="primaryForeground">
                      {otherUserName[0].toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={styles.avatarContainer}>
                {otherUser.imageUrl ? (
                  <Image
                    source={{ uri: otherUser.imageUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text variant="body" color="primaryForeground">
                      {otherUserName[0].toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.arrowContainer}>
                <ArrowDown size={20} color={colors.mutedForeground} />
              </View>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, styles.currentUserAvatar]}>
                  <Text variant="body" color="primaryForeground">
                    You
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text variant="bodyLarge" color="foreground" style={styles.title}>
            {isOwing
              ? `You owe ${otherUserName}`
              : `${otherUserName} owes you`}
          </Text>
          {contextInfo && (
            <Text variant="small" color="muted" style={styles.context}>
              {contextInfo}
            </Text>
          )}
          <View style={styles.amountRow}>
            <Text
              variant="h3"
              color={isOwing ? "destructive" : "success"}
              style={styles.amount}
            >
              {amount}
            </Text>
            <View style={styles.statusBadge}>
              <Text variant="caption" color="muted">
                {settlement.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function SettlementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const { apiRequest } = useApiClient();
  const [activeFilter, setActiveFilter] = useState<SettlementFilter>("all");
  const [settlements, setSettlements] = useState<SettlementWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const tabs: Array<{ key: SettlementFilter; label: string }> = [
    { key: "all", label: "All" },
    { key: "owing", label: "You Owe" },
    { key: "owed", label: "Owed to You" },
  ];

  const fetchSettlements = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      let endpoint = "/api/settlements?status=pending";
      
      if (activeFilter === "owing") {
        endpoint += "&direction=owing";
      } else if (activeFilter === "owed") {
        endpoint += "&direction=owed";
      }

      const response = await apiRequest<SettlementsResponse>(endpoint);
      setSettlements(response.settlements);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch settlements";
      setError(errorMessage);
      console.error("Error fetching settlements:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [userId, activeFilter, apiRequest]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSettlements();
  }, [fetchSettlements]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleSettlementPress = (settlementId: string) => {
    router.push(`/settlement/${settlementId}`);
  };

  const renderEmptyState = () => {
    const getEmptyStateContent = () => {
      switch (activeFilter) {
        case "all":
          return {
            title: "All Settled Up",
            description: "You don't have any pending settlements right now.",
          };
        case "owing":
          return {
            title: "Nothing to Pay",
            description: "You're all caught up! No outstanding payments.",
          };
        case "owed":
          return {
            title: "No Money Owed",
            description: "No one owes you money at the moment.",
          };
        default:
          return {
            title: "No Settlements",
            description: "You don't have any settlements to show.",
          };
      }
    };

    const { title, description } = getEmptyStateContent();
    
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <Wallet size={80} color={colors.mutedForeground} />
        </View>
        <Text variant="h2" color="foreground" style={styles.emptyTitle}>
          {title}
        </Text>
        <Text variant="body" color="muted" style={styles.emptyDescription}>
          {description}
        </Text>
      </View>
    );
  };

  const renderSettlementCard = ({
    item,
  }: {
    item: SettlementWithRelations;
  }) => {
    if (!userId) return null;
    
    return (
      <SettlementCard
        settlement={item}
        currentUserId={userId}
        onPress={() => handleSettlementPress(item.id)}
      />
    );
  };

  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text variant="h1" color="foreground" style={styles.headerTitle}>
          Settle Up
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Filter Tabs */}
      <SegmentedTabs
        tabs={tabs}
        activeTab={activeFilter}
        onTabChange={(tab) => setActiveFilter(tab)}
      />

      {/* Settlements List */}
      {isLoading && settlements.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && settlements.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="h2" color="foreground" style={styles.emptyTitle}>
            Error loading settlements
          </Text>
          <Text variant="body" color="muted" style={styles.emptyDescription}>
            {error}
          </Text>
        </View>
      ) : settlements.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={settlements}
          renderItem={renderSettlementCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 40, // Match back button width
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  settlementCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
  },
  currentUserAvatar: {
    backgroundColor: colors.primaryLight,
  },
  arrowContainer: {
    marginHorizontal: spacing.xs,
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  context: {
    marginBottom: spacing.xs,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amount: {
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    backgroundColor: colors.iconBackground,
    borderRadius: borderRadius.sm,
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
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

