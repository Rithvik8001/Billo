import { View, StyleSheet, Pressable, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, iconSizes, borderRadius, spacing, animation, shadows } from "@/constants/theme";
import type { TextColor } from "./Text";

type IconSize = keyof typeof iconSizes;

interface IconProps {
  /** Lucide icon component */
  icon: React.ComponentType<{ size?: number; color?: string }>;
  /** Icon size */
  size?: IconSize;
  /** Icon color */
  color?: TextColor;
  /** Show circular background */
  background?: boolean;
  /** Background color variant */
  backgroundVariant?: "default" | "light";
  /** Custom size (overrides size prop) */
  customSize?: number;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Style override */
  style?: ViewStyle;
}

const colorMap: Record<TextColor, string> = {
  foreground: colors.foreground,
  muted: colors.mutedForeground,
  primary: colors.primary,
  accent: colors.accent,
  destructive: colors.destructive,
  primaryForeground: colors.primaryForeground,
  success: colors.success,
};

export function Icon({
  icon: IconComponent,
  size = "md",
  color = "foreground",
  background = false,
  backgroundVariant = "default",
  customSize,
  accessibilityLabel,
  style,
}: IconProps) {
  const iconSize = customSize ?? iconSizes[size];
  const iconColor = colorMap[color];

  const iconElement = (
    <IconComponent size={iconSize} color={iconColor} />
  );

  if (background) {
    const backgroundColor =
      backgroundVariant === "light"
        ? colors.iconBackgroundLight
        : colors.iconBackground;

    // For larger icons, use more generous padding
    const paddingMultiplier = size === "3xl" || size === "2xl" ? 2.5 : 2;

    return (
      <View
        style={[
          styles.backgroundContainer,
          {
            width: iconSize + spacing.md * paddingMultiplier,
            height: iconSize + spacing.md * paddingMultiplier,
            borderRadius: borderRadius.full,
            backgroundColor,
          },
          style,
        ]}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
      >
        {iconElement}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      {iconElement}
    </View>
  );
}

// Circular icon button for action buttons (+ and arrow icons)
type IconButtonVariant = "primary" | "outlined";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps {
  /** Lucide icon component */
  icon: React.ComponentType<{ size?: number; color?: string }>;
  /** Button press handler */
  onPress: () => void;
  /** Button variant */
  variant?: IconButtonVariant;
  /** Button size */
  size?: IconButtonSize;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Style override */
  style?: ViewStyle;
  /** Disabled state */
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const buttonSizes: Record<IconButtonSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
};

export function IconButton({
  icon: IconComponent,
  onPress,
  variant = "primary",
  size = "md",
  accessibilityLabel,
  style,
  disabled = false,
}: IconButtonProps) {
  const pressed = useSharedValue(false);
  const buttonSize = buttonSizes[size];
  const iconSize = buttonSize * 0.45;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 0.95 : 1, {
          duration: animation.timing.fast,
        }),
      },
    ],
    opacity: withTiming(pressed.value ? 0.9 : 1, {
      duration: animation.timing.fast,
    }),
  }));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          ...shadows.md,
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.borderStrong,
        };
    }
  };

  const iconColor = variant === "primary" ? colors.primaryForeground : colors.foreground;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = true;
      }}
      onPressOut={() => {
        pressed.value = false;
      }}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={[
        styles.iconButton,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        getVariantStyles(),
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <IconComponent size={iconSize} color={iconColor} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
