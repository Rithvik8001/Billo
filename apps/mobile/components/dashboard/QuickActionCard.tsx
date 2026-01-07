import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { ChevronRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onPress?: () => void;
}

export function QuickActionCard({
  icon,
  label,
  description,
  onPress,
}: QuickActionCardProps) {
  return (
    <Card
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon icon={icon} size="md" color="primary" />
        </View>
        <View style={styles.textContainer}>
          <Text variant="bodyLarge" color="foreground" style={styles.label}>
            {label}
          </Text>
          {description && (
            <Text variant="small" color="muted" style={styles.description}>
              {description}
            </Text>
          )}
        </View>
        <Icon icon={ChevronRight} size="sm" color="muted" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryBackground,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: "600",
  },
  description: {
    marginTop: 2,
  },
});
