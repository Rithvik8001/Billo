import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui";
import { spacing, animation, borderRadius, colors } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SkipButtonProps {
  onPress: () => void;
}

export function SkipButton({ onPress }: SkipButtonProps) {
  const insets = useSafeAreaInsets();
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(pressed.value ? 0.7 : 1, {
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
      style={[
        styles.container,
        { top: insets.top + spacing.md },
        animatedStyle,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Skip onboarding"
      entering={FadeIn.delay(100).duration(300)}
    >
      <View style={styles.button}>
        <Text variant="body" color="foreground" style={styles.text}>
          Close
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 10,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});
