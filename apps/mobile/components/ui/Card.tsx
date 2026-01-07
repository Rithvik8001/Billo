import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, borderRadius, shadows, spacing, animation } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  /** Card style variant */
  variant?: CardVariant;
  /** Disable press animation */
  disablePressAnimation?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Card({
  children,
  onPress,
  style,
  variant = "default",
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

  const variantStyle = getVariantStyle(variant);

  const content = (
    <Animated.View style={[styles.card, variantStyle, animatedStyle, style]}>
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

function getVariantStyle(variant: CardVariant): ViewStyle {
  switch (variant) {
    case "default":
      return {
        ...shadows.card,
      };
    case "elevated":
      return {
        ...shadows.elevated,
      };
    case "outlined":
      return {
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: 0,
        elevation: 0,
      };
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg, // Refined from 2xl (was 32px, now 14px)
    padding: spacing.lg,
  },
});
