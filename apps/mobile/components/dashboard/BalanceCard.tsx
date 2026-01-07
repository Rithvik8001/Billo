import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, shadows } from "@/constants/theme";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react-native";

interface BalanceCardProps {
  label: string;
  amount: string;
  subtitle: string;
  variant?: "owe" | "owed" | "net" | "hero";
}

export function BalanceCard({
  label,
  amount,
  subtitle,
  variant = "net",
}: BalanceCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "owe":
        return {
          backgroundColor: colors.card,
          accentColor: colors.destructive,
          icon: TrendingDown,
          iconBg: `${colors.destructive}15`,
        };
      case "owed":
        return {
          backgroundColor: colors.card,
          accentColor: colors.success,
          icon: TrendingUp,
          iconBg: `${colors.success}15`,
        };
      case "net":
        return {
          backgroundColor: colors.card,
          accentColor: colors.foreground,
          icon: Wallet,
          iconBg: colors.iconBackground,
        };
      case "hero":
        return {
          backgroundColor: colors.primary,
          accentColor: colors.primaryForeground,
          icon: Wallet,
          iconBg: `${colors.primaryForeground}20`,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <Card
        style={[styles.heroCard, { backgroundColor: variantStyles.backgroundColor }]}
        variant="elevated"
        disablePressAnimation
      >
        <View style={[styles.heroIconContainer, { backgroundColor: variantStyles.iconBg }]}>
          <Icon
            icon={variantStyles.icon}
            size="lg"
            color="primaryForeground"
          />
        </View>
        <Text variant="caption" style={[styles.heroLabel, { color: `${colors.primaryForeground}90` }]}>
          {label}
        </Text>
        <Text
          variant="displayLarge"
          style={[styles.heroAmount, { color: variantStyles.accentColor }]}
        >
          {amount}
        </Text>
        <Text variant="small" style={[styles.heroSubtitle, { color: `${colors.primaryForeground}80` }]}>
          {subtitle}
        </Text>
      </Card>
    );
  }

  return (
    <Card
      style={[styles.card, { backgroundColor: variantStyles.backgroundColor }]}
      disablePressAnimation
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: variantStyles.iconBg }]}>
          <Icon
            icon={variantStyles.icon}
            size="sm"
            customSize={18}
            color={variant === "owe" ? "destructive" : variant === "owed" ? "success" : "foreground"}
          />
        </View>
        <Text variant="caption" color="muted" style={styles.label}>
          {label}
        </Text>
      </View>
      <Text
        variant="h2"
        style={[styles.amount, { color: variantStyles.accentColor }]}
      >
        {amount}
      </Text>
      <Text variant="small" color="muted" style={styles.subtitle}>
        {subtitle}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  label: {
    flex: 1,
  },
  amount: {
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
  },
  // Hero variant styles
  heroCard: {
    width: "100%",
    padding: spacing.xl,
    alignItems: "center",
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  heroLabel: {
    marginBottom: spacing.xs,
  },
  heroAmount: {
    marginBottom: spacing.xs,
    fontWeight: "700",
    textAlign: "center",
  },
  heroSubtitle: {
    textAlign: "center",
  },
});
