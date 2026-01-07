import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { ArrowLeft, Receipt as ReceiptIcon } from "lucide-react-native";
import { useActivityService } from "@/lib/activity-service";
import type { Receipt, ReceiptItem } from "@/types/activity";
import { formatAmount } from "@/lib/currency";

export default function ReceiptDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activityService = useActivityService();
  const serviceRef = useRef(activityService);
  serviceRef.current = activityService;

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReceipt = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const receiptData = await serviceRef.current.fetchReceipt(id);
      setReceipt(receiptData);
    } catch (error) {
      console.error("Error fetching receipt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReceipt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchReceipt();
    setRefreshing(false);
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

  const isManualReceipt = receipt?.imageUrl === "manual";

  if (isLoading && !receipt) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!receipt) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <Text variant="h3" color="foreground">
            Receipt not found
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
          Receipt Details
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
        {/* Receipt Image */}
        <Card style={styles.imageCard}>
          {isManualReceipt ? (
            <View style={styles.manualReceiptContainer}>
              <View style={styles.manualIconContainer}>
                <ReceiptIcon size={48} color={colors.mutedForeground} />
              </View>
              <Text variant="body" color="muted" style={styles.manualLabel}>
                Manual Entry
              </Text>
              <Text variant="small" color="muted">
                No image available
              </Text>
            </View>
          ) : receipt.imageUrl ? (
            <Image
              source={{ uri: receipt.imageUrl }}
              style={styles.receiptImage}
              resizeMode="contain"
            />
          ) : null}
        </Card>

        {/* Receipt Info */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text variant="body" color="muted">
              Merchant
            </Text>
            <Text
              variant="bodyLarge"
              color="foreground"
              style={styles.infoValue}
            >
              {receipt.merchantName || "Unknown"}
            </Text>
          </View>

          {receipt.purchaseDate && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="body" color="muted">
                  Date
                </Text>
                <Text
                  variant="bodyLarge"
                  color="foreground"
                  style={styles.infoValue}
                >
                  {formatDate(receipt.purchaseDate)}
                </Text>
              </View>
            </>
          )}

          {receipt.totalAmount && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="body" color="muted">
                  Total
                </Text>
                <Text variant="h3" color="foreground" style={styles.infoValue}>
                  {formatAmount(receipt.totalAmount)}
                </Text>
              </View>
            </>
          )}

          {receipt.tax && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text variant="body" color="muted">
                  Tax
                </Text>
                <Text
                  variant="bodyLarge"
                  color="foreground"
                  style={styles.infoValue}
                >
                  {formatAmount(receipt.tax)}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Items List */}
        {receipt.items && receipt.items.length > 0 && (
          <Card style={styles.itemsCard}>
            <Text variant="h3" color="foreground" style={styles.itemsTitle}>
              Items ({receipt.items.length})
            </Text>
            {receipt.items.map((item: ReceiptItem, index: number) => (
              <View key={item.id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text
                      variant="bodyLarge"
                      color="foreground"
                      style={styles.itemName}
                    >
                      {item.name}
                    </Text>
                    {item.quantity && (
                      <Text variant="small" color="muted">
                        Qty: {item.quantity}
                        {item.unitPrice && ` × ${formatAmount(item.unitPrice)}`}
                      </Text>
                    )}
                  </View>
                  {item.totalPrice && (
                    <Text
                      variant="bodyLarge"
                      color="foreground"
                      style={styles.itemPrice}
                    >
                      {formatAmount(item.totalPrice)}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
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
    paddingTop: spacing.md,
  },
  imageCard: {
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  manualReceiptContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  manualIconContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: colors.iconBackgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  manualLabel: {
    marginBottom: spacing.xs,
    fontWeight: "600",
  },
  receiptImage: {
    width: "100%",
    height: 400,
    backgroundColor: colors.iconBackground,
  },
  infoCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoValue: {
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  itemsCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  itemsTitle: {
    marginBottom: spacing.md,
    fontWeight: "600",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  itemPrice: {
    fontWeight: "600",
  },
});
