import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
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
import { Image } from "expo-image";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius } from "@/constants/theme";
import {
  ArrowLeft,
  ArrowDown,
  Wallet,
  CheckCircle,
  User,
  Receipt,
  Users,
} from "lucide-react-native";
import { useActivityService } from "@/lib/activity-service";
import { useUser } from "@clerk/clerk-expo";
import type { Settlement } from "@/types/activity";
import { formatAmount } from "@/lib/currency";

export default function SettlementDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activityService = useActivityService();
  const serviceRef = useRef(activityService);
  serviceRef.current = activityService;
  const { user } = useUser();

  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSettlement();
    }
  }, [id]);

  const fetchSettlement = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const settlementData = await serviceRef.current.fetchSettlement(id);
      setSettlement(settlementData);
    } catch (error) {
      console.error("Error fetching settlement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchSettlement();
    setRefreshing(false);
  };

  const handleMarkPaid = async () => {
    if (!settlement || !id) return;

    setIsUpdating(true);
    try {
      const updated = await serviceRef.current.updateSettlementStatus(
        id,
        "completed"
      );
      setSettlement(updated);
    } catch (error) {
      console.error("Error marking settlement as paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkUnpaid = async () => {
    if (!settlement || !id) return;

    setIsUpdating(true);
    try {
      const updated = await serviceRef.current.updateSettlementStatus(
        id,
        "pending"
      );
      setSettlement(updated);
    } catch (error) {
      console.error("Error marking settlement as unpaid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading && !settlement) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!settlement) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text variant="h3" color="foreground">
            Settlement not found
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

  const isOwing = settlement.fromUserId === user?.id;
  const isOwed = settlement.toUserId === user?.id;
  const otherUser = isOwing ? settlement.toUser : settlement.fromUser;
  const otherUserName = otherUser.name || otherUser.email.split("@")[0];
  const isCompleted = settlement.status === "completed";
  const canMarkPaid = !isCompleted && isOwing;
  const canMarkUnpaid = isCompleted && (isOwing || isOwed);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Pressable>
        <Text variant="h2" color="foreground" style={styles.headerTitle}>
          Settlement Details
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero Amount Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Icon
              icon={isCompleted ? CheckCircle : Wallet}
              size="2xl"
              color={
                isCompleted ? "success" : isOwing ? "destructive" : "success"
              }
              background
            />
            <View style={styles.heroAmountContainer}>
              <Text
                variant="caption"
                color="muted"
                style={styles.heroStatusLabel}
              >
                {isCompleted ? "PAID" : isOwing ? "YOU OWE" : "OWED TO YOU"}
              </Text>
              <Text
                variant="display"
                color={
                  isCompleted ? "success" : isOwing ? "destructive" : "success"
                }
                style={styles.heroAmount}
              >
                {formatAmount(settlement.amount, settlement.currency)}
              </Text>
              {settlement.status === "completed" && settlement.settledAt && (
                <Text variant="small" color="muted" style={styles.heroDate}>
                  Settled on {formatDate(settlement.settledAt)}
                </Text>
              )}
            </View>
          </View>
        </Card>

        {/* Transaction Flow Card */}
        <Card style={styles.transactionCard}>
          <View style={styles.transactionFlow}>
            {/* From User */}
            <View style={styles.transactionUser}>
              {settlement.fromUser.imageUrl ? (
                <Image
                  source={{ uri: settlement.fromUser.imageUrl }}
                  style={styles.transactionAvatar}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.transactionAvatarPlaceholder}>
                  <User size={28} color={colors.mutedForeground} />
                </View>
              )}
              <View style={styles.transactionUserInfo}>
                <Text
                  variant="bodyLarge"
                  color="foreground"
                  style={styles.transactionUserName}
                >
                  {settlement.fromUser.name ||
                    settlement.fromUser.email.split("@")[0]}
                </Text>
                <Text variant="small" color="muted">
                  {isOwing ? "You" : settlement.fromUser.email}
                </Text>
              </View>
            </View>

            {/* Arrow */}
            <View style={styles.transactionArrow}>
              <ArrowDown size={24} color={colors.mutedForeground} />
              <Text
                variant="caption"
                color="muted"
                style={styles.transactionPaysLabel}
              >
                pays
              </Text>
            </View>

            {/* To User */}
            <View style={styles.transactionUser}>
              {settlement.toUser.imageUrl ? (
                <Image
                  source={{ uri: settlement.toUser.imageUrl }}
                  style={styles.transactionAvatar}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.transactionAvatarPlaceholder}>
                  <User size={28} color={colors.mutedForeground} />
                </View>
              )}
              <View style={styles.transactionUserInfo}>
                <Text
                  variant="bodyLarge"
                  color="foreground"
                  style={styles.transactionUserName}
                >
                  {settlement.toUser.name ||
                    settlement.toUser.email.split("@")[0]}
                </Text>
                <Text variant="small" color="muted">
                  {isOwed ? "You" : settlement.toUser.email}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Receipt Info */}
        {settlement.receipt && (
          <Card style={styles.contextCard}>
            <View style={styles.contextHeader}>
              <Icon icon={Receipt} size="sm" color="accent" background />
              <Text variant="h3" color="foreground" style={styles.contextTitle}>
                Receipt
              </Text>
            </View>
            <View style={styles.contextRow}>
              <Text variant="body" color="muted">
                Merchant
              </Text>
              <Text
                variant="body"
                color="foreground"
                style={styles.contextValue}
              >
                {settlement.receipt.merchantName || "Unknown"}
              </Text>
            </View>
            {settlement.receipt.totalAmount && (
              <>
                <View style={styles.contextDivider} />
                <View style={styles.contextRow}>
                  <Text variant="body" color="muted">
                    Total
                  </Text>
                  <Text
                    variant="body"
                    color="foreground"
                    style={styles.contextValue}
                  >
                    {formatAmount(settlement.receipt.totalAmount)}
                  </Text>
                </View>
              </>
            )}
            {settlement.receipt.purchaseDate && (
              <>
                <View style={styles.contextDivider} />
                <View style={styles.contextRow}>
                  <Text variant="body" color="muted">
                    Date
                  </Text>
                  <Text
                    variant="body"
                    color="foreground"
                    style={styles.contextValue}
                  >
                    {formatDate(settlement.receipt.purchaseDate)}
                  </Text>
                </View>
              </>
            )}
          </Card>
        )}

        {/* Group Info */}
        {settlement.group && (
          <Card style={styles.contextCard}>
            <View style={styles.contextHeader}>
              <Icon icon={Users} size="sm" color="accent" background />
              <Text variant="h3" color="foreground" style={styles.contextTitle}>
                Group
              </Text>
            </View>
            <View style={styles.contextRow}>
              <Text variant="body" color="muted">
                Name
              </Text>
              <Text
                variant="body"
                color="foreground"
                style={styles.contextValue}
              >
                {settlement.group.emoji} {settlement.group.name}
              </Text>
            </View>
          </Card>
        )}

        {/* Notes */}
        {settlement.notes && (
          <Card style={styles.contextCard}>
            <Text variant="body" color="muted" style={styles.notesLabel}>
              Notes
            </Text>
            <Text variant="body" color="foreground" style={styles.notesText}>
              {settlement.notes}
            </Text>
          </Card>
        )}

        {/* Actions */}
        {(canMarkPaid || canMarkUnpaid) && (
          <View style={styles.actionsContainer}>
            {canMarkPaid && (
              <Button
                variant="default"
                size="lg"
                onPress={handleMarkPaid}
                disabled={isUpdating}
                icon={
                  <CheckCircle size={20} color={colors.primaryForeground} />
                }
                fullWidth
              >
                Mark as Paid
              </Button>
            )}
            {canMarkUnpaid && (
              <Button
                variant="outline"
                size="lg"
                onPress={handleMarkUnpaid}
                disabled={isUpdating}
                fullWidth
              >
                Mark as Unpaid
              </Button>
            )}
          </View>
        )}
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  // Hero Amount Card
  heroCard: {
    marginBottom: spacing.lg,
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.xl,
  },
  heroContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  heroAmountContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  heroStatusLabel: {
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  heroAmount: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "700",
  },
  heroDate: {
    marginTop: spacing.sm,
  },
  // Transaction Flow Card
  transactionCard: {
    marginBottom: spacing.lg,
    padding: spacing.xl,
  },
  transactionFlow: {
    alignItems: "center",
  },
  transactionUser: {
    alignItems: "center",
    width: "100%",
  },
  transactionAvatar: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  transactionAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.iconBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  transactionUserInfo: {
    alignItems: "center",
  },
  transactionUserName: {
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
    textAlign: "center",
  },
  transactionArrow: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  transactionPaysLabel: {
    marginTop: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Context Cards (Receipt, Group, Notes)
  contextCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  contextHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  contextTitle: {
    marginLeft: spacing.sm,
    fontWeight: "600",
    fontSize: 16,
  },
  contextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  contextValue: {
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
    marginLeft: spacing.md,
  },
  contextDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  notesLabel: {
    marginBottom: spacing.sm,
  },
  notesText: {
    lineHeight: 20,
  },
  // Actions
  actionsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
