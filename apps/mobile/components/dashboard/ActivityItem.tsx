import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius } from "@/constants/theme";
import type { LucideIcon } from "lucide-react-native";

interface ActivityItemProps {
  icon: LucideIcon;
  iconColor?: "foreground" | "destructive" | "success" | "accent";
  title: string;
  description?: string;
  timestamp: string;
  amount?: string;
  amountColor?: "foreground" | "destructive" | "success" | "muted";
  onPress?: () => void;
}

export function ActivityItem({
  icon,
  iconColor = "foreground",
  title,
  description,
  timestamp,
  amount,
  amountColor = "foreground",
  onPress,
}: ActivityItemProps) {
  // Combine description and timestamp if both exist
  const subtitle = description
    ? `${description} • ${timestamp}`
    : timestamp;

  return (
    <Card style={styles.card} onPress={onPress} accessibilityLabel={title}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Icon
            icon={icon}
            size="xl"
            color={iconColor}
            background
          />
        </View>
        <View style={styles.centerSection}>
          <Text variant="bodyLarge" color="foreground" style={styles.title}>
            {title}
          </Text>
          <Text variant="small" color="muted" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
        {amount && (
          <View style={styles.rightSection}>
            <Text variant="bodyLarge" color={amountColor} style={styles.amount}>
              {amount}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    marginRight: spacing.md,
  },
  centerSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: "600",
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontWeight: "600",
    fontSize: 16,
  },
});
