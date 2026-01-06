import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "@/components/ui";
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
      entering={FadeIn.delay(300).duration(400)}
    >
      <Button
        onPress={onPress}
        variant="default"
        size="lg"
        fullWidth
        loading={loading}
        accessibilityLabel={
          isLastScreen ? "Get started with Billo" : "Go to next screen"
        }
        accessibilityHint={
          isLastScreen
            ? "Completes onboarding and opens the main app"
            : "Shows the next onboarding screen"
        }
      >
        {isLastScreen ? "Get Started" : "Next"}
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
