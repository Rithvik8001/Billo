import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing } from "@/constants/theme";
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
  return (
    <Card style={styles.card} onPress={onPress} accessibilityLabel={title}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Icon icon={icon} size="md" color={iconColor} background />
        </View>
        <View style={styles.centerSection}>
          <Text variant="body" color="foreground" style={styles.title}>
            {title}
          </Text>
          {description && (
            <Text variant="small" color="muted" style={styles.description}>
              {description}
            </Text>
          )}
          <Text variant="small" color="muted" style={styles.timestamp}>
            {timestamp}
          </Text>
        </View>
        {amount && (
          <View style={styles.rightSection}>
            <Text variant="body" color={amountColor} style={styles.amount}>
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
  },
  title: {
    fontWeight: "500",
    marginBottom: spacing.xs / 2,
  },
  description: {
    marginBottom: spacing.xs / 2,
  },
  timestamp: {
    fontSize: 11,
  },
  rightSection: {
    marginLeft: spacing.md,
  },
  amount: {
    fontWeight: "600",
  },
});
