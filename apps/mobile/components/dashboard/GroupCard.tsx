import { View, StyleSheet } from "react-native";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius } from "@/constants/theme";
import { Users, ChevronRight } from "lucide-react-native";

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
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.info}>
          <Text variant="bodyLarge" color="foreground" style={styles.name}>
            {name}
          </Text>
          <View style={styles.meta}>
            <View style={styles.memberInfo}>
              <Icon icon={Users} size="sm" customSize={14} color="muted" />
              <Text variant="small" color="muted" style={styles.memberCount}>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </Text>
            </View>
            {balance && (
              <>
                <Text variant="small" color="muted" style={styles.dot}>•</Text>
                <Text variant="small" color="foreground" style={styles.balance}>
                  {balance}
                </Text>
              </>
            )}
          </View>
        </View>
        <Icon icon={ChevronRight} size="sm" color="muted" />
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
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.iconBackground,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    marginBottom: 2,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs / 2,
  },
  memberCount: {
    fontSize: 12,
  },
  dot: {
    marginHorizontal: spacing.xs,
  },
  balance: {
    fontSize: 12,
    fontWeight: "600",
  },
});
