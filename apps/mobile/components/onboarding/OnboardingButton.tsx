import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import { Button, Icon } from "@/components/ui";
import { spacing } from "@/constants/theme";

interface OnboardingButtonProps {
  isLastScreen: boolean;
  onPress: () => void;
  loading?: boolean;
}

export function OnboardingButton({
  isLastScreen,
  onPress,
  loading = false,
}: OnboardingButtonProps) {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.delay(200).duration(300)}
    >
      {isLastScreen ? (
        <View style={styles.buttonRow}>
          <Button
            onPress={onPress}
            variant="outline"
            size="default"
            style={styles.outlineButton}
            accessibilityLabel="Get started with Billo"
          >
            Get Started
          </Button>
          <Button
            onPress={onPress}
            variant="gradient"
            size="default"
            icon={<Icon icon={Sparkles} size="sm" color="primaryForeground" />}
            iconPosition="left"
            style={styles.gradientButton}
            accessibilityLabel="Get started with AI assistance"
          >
            Create for me
          </Button>
        </View>
      ) : (
        <Button
          onPress={onPress}
          variant="default"
          size="default"
          fullWidth
          loading={loading}
          accessibilityLabel="Continue to next screen"
        >
          Continue
        </Button>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  outlineButton: {
    flex: 1,
  },
  gradientButton: {
    flex: 1,
  },
});
