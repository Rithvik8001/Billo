import {
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  colors,
  borderRadius,
  spacing,
  animation,
  shadows,
} from "@/constants/theme";
import { Text } from "./Text";

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "gradient"
  | "card"
  | "social";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
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
  }));

  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = true;
      }}
      onPressOut={() => {
        pressed.value = false;
      }}
      disabled={isDisabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === "string" ? children : undefined)
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled }}
      style={[
        styles.base,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {icon && iconPosition === "left" && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text
        variant={size === "sm" ? "small" : size === "lg" ? "bodyLarge" : "body"}
        color={variantStyles.textColor}
        style={[sizeStyles.text, isDisabled && styles.disabledText]}
      >
        {loading ? "Loading..." : children}
      </Text>
      {icon && iconPosition === "right" && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </AnimatedPressable>
  );
}

function getVariantStyles(variant: ButtonVariant): {
  container: ViewStyle;
  textColor: "foreground" | "primaryForeground" | "destructive" | "muted";
} {
  switch (variant) {
    case "default":
      return {
        container: {
          backgroundColor: colors.primary,
          ...shadows.button,
        },
        textColor: "primaryForeground",
      };
    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
        },
        textColor: "foreground",
      };
    case "ghost":
      return {
        container: {
          backgroundColor: "transparent",
        },
        textColor: "foreground",
      };
    case "destructive":
      return {
        container: {
          backgroundColor: colors.destructive,
        },
        textColor: "primaryForeground",
      };
    case "gradient":
      return {
        container: {
          backgroundColor: colors.gradientStart,
          ...shadows.button,
        },
        textColor: "primaryForeground",
      };
    case "card":
      return {
        container: {
          backgroundColor: colors.foreground,
          width: 40,
          height: 40,
          borderRadius: borderRadius.full,
          padding: 0,
        },
        textColor: "primaryForeground",
      };
    case "social":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
        },
        textColor: "foreground",
      };
  }
}

function getSizeStyles(size: ButtonSize): {
  container: ViewStyle;
  text: TextStyle;
} {
  switch (size) {
    case "sm":
      return {
        container: {
          paddingHorizontal: spacing.md,
          paddingVertical: 10,
          borderRadius: borderRadius.md, // Refined from full
          minHeight: 40,
        },
        text: {
          fontWeight: "500",
          fontSize: 14,
        },
      };
    case "default":
      return {
        container: {
          paddingHorizontal: spacing.lg,
          paddingVertical: 14,
          borderRadius: borderRadius.md, // Refined from full
          minHeight: 52,
        },
        text: {
          fontWeight: "600",
          fontSize: 16,
        },
      };
    case "lg":
      return {
        container: {
          paddingHorizontal: spacing.xl,
          paddingVertical: 16,
          borderRadius: borderRadius.md, // Refined from full
          minHeight: 56,
        },
        text: {
          fontWeight: "600",
          fontSize: 17,
        },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
