import {
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, borderRadius, spacing, animation } from "@/constants/theme";
import { Text } from "./Text";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";
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
      <Text
        variant={size === "sm" ? "small" : "body"}
        color={variantStyles.textColor}
        style={[sizeStyles.text, isDisabled && styles.disabledText]}
      >
        {loading ? "Loading..." : children}
      </Text>
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
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.md,
        },
        text: {
          fontWeight: "500",
        },
      };
    case "default":
      return {
        container: {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md - 4,
          borderRadius: borderRadius.lg,
        },
        text: {
          fontWeight: "600",
        },
      };
    case "lg":
      return {
        container: {
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.lg,
        },
        text: {
          fontWeight: "600",
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
});
