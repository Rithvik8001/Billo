import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { spacing } from "@/constants/theme";
import type { LucideIcon } from "lucide-react-native";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
}

export function QuickActionCard({
  icon,
  label,
  onPress,
}: QuickActionCardProps) {
  return (
    <Card
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon icon={icon} size="lg" color="foreground" background />
        </View>
        <Text variant="body" color="foreground" style={styles.label}>
          {label}
        </Text>
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
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: spacing.sm,
  },
  label: {
    textAlign: "center",
    fontWeight: "500",
  },
});

