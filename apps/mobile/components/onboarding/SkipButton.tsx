import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { spacing, animation } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SkipButtonProps {
  /** Handler for skip action */
  onPress: () => void;
}

export function SkipButton({ onPress }: SkipButtonProps) {
  const insets = useSafeAreaInsets();
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.6 : 1, {
      duration: animation.timing.fast,
    }),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = true;
      }}
      onPressOut={() => {
        pressed.value = false;
      }}
      style={[styles.container, { top: insets.top + spacing.sm }, animatedStyle]}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Skip onboarding"
      accessibilityHint="Skips the onboarding and goes directly to the main app"
      entering={FadeIn.delay(200).duration(300)}
    >
      <Text variant="body" color="foreground">
        Skip
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: spacing.lg,
    padding: spacing.sm,
    zIndex: 10,
  },
});
