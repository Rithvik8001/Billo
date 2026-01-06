import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { colors, spacing, borderRadius } from "@/constants/theme";

interface BalanceCardProps {
  label: string;
  amount: string;
  subtitle: string;
  variant?: "owe" | "owed" | "net";
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
          backgroundColor: colors.iconBackground,
          accentColor: colors.destructive,
        };
      case "owed":
        return {
          backgroundColor: colors.iconBackground,
          accentColor: colors.success,
        };
      case "net":
        return {
          backgroundColor: colors.iconBackground,
          accentColor: colors.mutedForeground,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Card
      style={[
        styles.card,
        { backgroundColor: variantStyles.backgroundColor },
      ]}
      disablePressAnimation
    >
      <Text variant="caption" color="muted" style={styles.label}>
        {label}
      </Text>
      <Text
        variant="h1"
        color="foreground"
        style={[
          styles.amount,
          { color: variantStyles.accentColor },
        ]}
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
    padding: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  amount: {
    marginBottom: spacing.xs / 2,
    fontFamily: "monospace",
  },
  subtitle: {
    fontSize: 12,
  },
});

