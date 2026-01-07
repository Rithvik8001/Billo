import { View, StyleSheet, Linking, Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Crown, ExternalLink, AlertCircle, ScanLine, Sparkles } from "lucide-react-native";
import { useSubscription } from "@/hooks/useSubscription";
import { useAiUsage } from "@/hooks/useAiUsage";
import { useUser } from "@clerk/clerk-expo";
// Format date helper
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscriptionCard() {
  const { subscription, isLoading, isPro } = useSubscription();
  const { usage } = useAiUsage();
  const { user } = useUser();

  const handleUpgrade = () => {
    const checkoutUrl = new URL(
      `${process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") || ""}/api/polar/checkout`
    );
    checkoutUrl.searchParams.set(
      "products",
      process.env.EXPO_PUBLIC_POLAR_PRODUCT_ID || ""
    );
    if (user?.id) {
      checkoutUrl.searchParams.set("customerExternalId", user.id);
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      checkoutUrl.searchParams.set("customerEmail", user.emailAddresses[0].emailAddress);
    }
    if (user?.fullName) {
      checkoutUrl.searchParams.set("customerName", user.fullName);
    }

    Linking.openURL(checkoutUrl.toString());
  };

  const handleManageSubscription = () => {
    Linking.openURL(`${process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") || ""}/api/polar/portal`);
  };

  if (isLoading || !subscription) {
    return (
      <Card style={styles.card}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color="muted">
            Loading subscription...
          </Text>
        </View>
      </Card>
    );
  }

  if (!isPro) {
    // Free user - Upgrade CTA
    return (
      <Card
        style={[
          styles.card,
          styles.upgradeCard,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Icon icon={Crown} size="lg" color="primaryForeground" />
            <Text variant="h3" color="primaryForeground" style={styles.title}>
              Billo Pro
            </Text>
          </View>
          <Text variant="small" color="primaryForeground" style={styles.description}>
            Unlock more AI receipt scanning power
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Icon icon={ScanLine} size="md" color="primaryForeground" />
            <Text variant="body" color="primaryForeground">
              50 AI scans per day (vs 3 free)
            </Text>
          </View>
          <View style={styles.feature}>
            <Icon icon={Sparkles} size="md" color="primaryForeground" />
            <Text variant="body" color="primaryForeground">
              Priority processing
            </Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text variant="h1" color="primaryForeground" style={styles.price}>
            $2.99
          </Text>
          <Text variant="body" color="primaryForeground" style={styles.priceUnit}>
            /month
          </Text>
        </View>

        <Button
          variant="default"
          size="lg"
          onPress={handleUpgrade}
          style={styles.upgradeButton}
          icon={<Crown size={20} color={colors.primaryForeground} />}
        >
          Upgrade Now
        </Button>
      </Card>
    );
  }

  // Pro user - Status card
  const isCanceled = subscription.status === "canceled";

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon icon={Crown} size="lg" color="primary" />
          <Text variant="h3" color="foreground" style={styles.title}>
            Billo Pro
          </Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: isCanceled ? colors.iconBackground : colors.primary },
            ]}
          >
            <Text
              variant="caption"
              color={isCanceled ? "foreground" : "primaryForeground"}
              style={styles.badgeText}
            >
              {isCanceled ? "Canceling" : "Active"}
            </Text>
          </View>
        </View>
        {subscription.currentPeriodEnd && (
          <Text variant="small" color="muted" style={styles.description}>
            {isCanceled
              ? `Access until ${formatDate(subscription.currentPeriodEnd)}`
              : `Renews ${formatDate(subscription.currentPeriodEnd)}`}
          </Text>
        )}
      </View>

      {isCanceled && (
        <View style={styles.warningBox}>
          <AlertCircle size={16} color={colors.warning} />
          <Text variant="small" color="foreground" style={styles.warningText}>
            Your subscription has been canceled and will end on{" "}
            {subscription.currentPeriodEnd &&
              formatDate(subscription.currentPeriodEnd)}
            .
          </Text>
        </View>
      )}

      {usage && (
        <View style={styles.usageContainer}>
          <View style={styles.usageBar}>
            <View
              style={[
                styles.usageFill,
                {
                  width: `${(usage.used / usage.limit) * 100}%`,
                  backgroundColor: usage.isLimited ? colors.destructive : colors.success,
                },
              ]}
            />
          </View>
          <Text variant="small" color="muted" style={styles.usageText}>
            {usage.used}/{usage.limit} scans today
          </Text>
        </View>
      )}

      <Text variant="small" color="muted" style={styles.infoText}>
        50 AI scans per day included
      </Text>

      {subscription.hasPortalAccess && (
        <Button
          variant="outline"
          size="default"
          onPress={handleManageSubscription}
          icon={<ExternalLink size={16} color={colors.foreground} />}
          style={styles.manageButton}
        >
          Manage Subscription
        </Button>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  upgradeCard: {
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
  },
  description: {
    marginTop: spacing.xs / 2,
    opacity: 0.9,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm, // Refined
  },
  badgeText: {
    fontWeight: "600",
  },
  features: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  price: {
    fontWeight: "700",
  },
  priceUnit: {
    opacity: 0.9,
  },
  upgradeButton: {
    marginTop: spacing.sm,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.warning}20`,
    borderRadius: borderRadius.md, // Refined
    marginBottom: spacing.md,
  },
  warningText: {
    flex: 1,
    lineHeight: 20,
  },
  usageContainer: {
    marginBottom: spacing.sm,
  },
  usageBar: {
    height: 8,
    backgroundColor: colors.iconBackground,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  usageFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  usageText: {
    fontSize: 12,
  },
  infoText: {
    marginBottom: spacing.md,
  },
  manageButton: {
    marginTop: spacing.sm,
  },
});

