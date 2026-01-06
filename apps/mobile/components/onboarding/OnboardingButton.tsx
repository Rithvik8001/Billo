import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
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
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/(auth)/sign-up");
  };

  const handleSignIn = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.delay(200).duration(300)}
    >
      {isLastScreen ? (
        <View style={styles.buttonColumn}>
          <Button
            onPress={handleSignUp}
            variant="default"
            size="default"
            fullWidth
            accessibilityLabel="Sign up for Billo"
          >
            Sign Up
          </Button>
          <Button
            onPress={handleSignIn}
            variant="outline"
            size="default"
            fullWidth
            style={styles.signInButton}
            accessibilityLabel="Sign in to Billo"
          >
            Sign In
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
  buttonColumn: {
    gap: spacing.md,
  },
  signInButton: {
    marginTop: spacing.xs,
  },
});
