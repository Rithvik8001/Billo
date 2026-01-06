import { View, StyleSheet } from "react-native";
import { Camera, Users, Wallet } from "lucide-react-native";
import { Text } from "@/components/ui";
import { spacing, colors } from "@/constants/theme";

interface Feature {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Camera,
    title: "Scan receipts instantly",
    description: "Snap a photo and let AI do the work",
  },
  {
    icon: Users,
    title: "Split bills fairly",
    description: "Tap your items and see who owes what",
  },
  {
    icon: Wallet,
    title: "Settle up easily",
    description: "Track payments and balances in one place",
  },
];

export function AuthFeatureList() {
  return (
    <View style={styles.container}>
      {features.map((feature, index) => {
        return (
          <View key={index} style={styles.featureItem}>
            <View style={styles.dot} />
            <View style={styles.featureContent}>
              <Text variant="h3" color="foreground" style={styles.featureTitle}>
                {feature.title}
              </Text>
              <Text
                variant="small"
                color="muted"
                style={styles.featureDescription}
              >
                {feature.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: spacing.xs,
  },
  featureDescription: {
    lineHeight: 20,
  },
});
