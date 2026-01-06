import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "@/components/ui";
import { colors, spacing } from "@/constants/theme";
import { resetOnboarding } from "@/utils/storage";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    router.replace("/(onboarding)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text variant="display" color="foreground" style={styles.logo}>
          Billo
        </Text>
        <Text variant="h2" color="foreground" style={styles.title}>
          Welcome to Billo!
        </Text>
        <Text variant="bodyLarge" color="muted" style={styles.subtitle}>
          Scan. Tap. Split.
        </Text>
        <Text variant="body" color="muted" style={styles.description}>
          The main app screens are coming soon. This is a placeholder after
          completing onboarding.
        </Text>

        {/* Dev button to reset onboarding */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <Text variant="caption" color="muted" style={styles.devLabel}>
              Development
            </Text>
            <Button variant="outline" onPress={handleResetOnboarding}>
              Reset Onboarding
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logo: {
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  description: {
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  devSection: {
    marginTop: spacing["2xl"],
    alignItems: "center",
  },
  devLabel: {
    marginBottom: spacing.sm,
  },
});
