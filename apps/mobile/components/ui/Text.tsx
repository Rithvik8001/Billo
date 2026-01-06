import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from "react-native";
import { colors, typography } from "@/constants/theme";

type TextVariant = "display" | "h1" | "h2" | "h3" | "body" | "bodyLarge" | "small" | "caption";
type TextColor = "foreground" | "muted" | "primary" | "accent" | "destructive" | "primaryForeground" | "success";

interface TextProps extends RNTextProps {
  /** Typography variant */
  variant?: TextVariant;
  /** Text color */
  color?: TextColor;
  /** Children nodes */
  children: React.ReactNode;
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

export function Text({
  variant = "body",
  color = "foreground",
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        { color: colorMap[color] },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
  display: {
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    fontWeight: typography.display.fontWeight,
    letterSpacing: typography.display.letterSpacing,
  },
  h1: {
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    fontWeight: typography.h1.fontWeight,
    letterSpacing: typography.h1.letterSpacing,
  },
  h2: {
    fontSize: typography.h2.fontSize,
    lineHeight: typography.h2.lineHeight,
    fontWeight: typography.h2.fontWeight,
    letterSpacing: typography.h2.letterSpacing,
  },
  h3: {
    fontSize: typography.h3.fontSize,
    lineHeight: typography.h3.lineHeight,
    fontWeight: typography.h3.fontWeight,
    letterSpacing: typography.h3.letterSpacing,
  },
  body: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
  },
  bodyLarge: {
    fontSize: typography.bodyLarge.fontSize,
    lineHeight: typography.bodyLarge.lineHeight,
    fontWeight: typography.bodyLarge.fontWeight,
  },
  small: {
    fontSize: typography.small.fontSize,
    lineHeight: typography.small.lineHeight,
    fontWeight: typography.small.fontWeight,
  },
  caption: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    letterSpacing: typography.caption.letterSpacing,
    textTransform: typography.caption.textTransform,
  },
});
