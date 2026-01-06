import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, borderRadius, shadows, spacing, animation } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** Disable press animation */
  disablePressAnimation?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Card({
  children,
  onPress,
  style,
  disablePressAnimation = false,
  accessibilityLabel,
}: CardProps) {
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    if (disablePressAnimation || !onPress) {
      return {};
    }

    return {
      transform: [
        {
          scale: withTiming(pressed.value ? 0.98 : 1, {
            duration: animation.timing.fast,
          }),
        },
      ],
      opacity: withTiming(pressed.value ? 0.9 : 1, {
        duration: animation.timing.fast,
      }),
    };
  });

  const content = (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          pressed.value = true;
        }}
        onPressOut={() => {
          pressed.value = false;
        }}
        accessible={!!accessibilityLabel}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.card,
  },
});

