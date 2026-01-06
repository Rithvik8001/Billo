import { View, StyleSheet, type ViewStyle } from "react-native";
import { colors, iconSizes, borderRadius, spacing } from "@/constants/theme";
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

