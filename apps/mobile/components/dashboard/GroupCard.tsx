import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing } from "@/constants/theme";
import { Users } from "lucide-react-native";

interface GroupCardProps {
  emoji?: string;
  name: string;
  memberCount: number;
  balance?: string;
  onPress?: () => void;
}

export function GroupCard({
  emoji = "👥",
  name,
  memberCount,
  balance,
  onPress,
}: GroupCardProps) {
  return (
    <Card style={styles.card} onPress={onPress} accessibilityLabel={name}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.info}>
            <Text variant="h3" color="foreground" style={styles.name}>
              {name}
            </Text>
            <View style={styles.memberInfo}>
              <Icon icon={Users} size="sm" color="muted" />
              <Text variant="small" color="muted" style={styles.memberCount}>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </Text>
            </View>
          </View>
        </View>
        {balance && (
          <View style={styles.balanceSection}>
            <Text variant="body" color="muted" style={styles.balanceLabel}>
              Balance
            </Text>
            <Text variant="body" color="foreground" style={styles.balance}>
              {balance}
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
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: spacing.xs / 2,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  memberCount: {
    fontSize: 12,
  },
  balanceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  balanceLabel: {
    fontSize: 12,
  },
  balance: {
    fontWeight: "600",
  },
});

