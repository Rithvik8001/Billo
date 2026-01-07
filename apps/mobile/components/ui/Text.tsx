import { Text as RNText, StyleSheet, View, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { colors, typography } from "@/constants/theme";

export type TextVariant = "displayLarge" | "hero" | "display" | "h1" | "h2" | "h3" | "body" | "bodyLarge" | "small" | "caption";
export type TextColor = "foreground" | "muted" | "primary" | "accent" | "destructive" | "primaryForeground" | "success";

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

// Mixed weight text for "You are on Top" + "of your Finances" pattern
interface MixedTextProps {
  /** Bold portion of text */
  boldText: string;
  /** Light/normal weight portion */
  lightText: string;
  /** Typography variant for sizing */
  variant?: TextVariant;
  /** Color for the bold text */
  boldColor?: TextColor;
  /** Color for the light text */
  lightColor?: TextColor;
}

export function MixedText({
  boldText,
  lightText,
  variant = "h1",
  boldColor = "foreground",
  lightColor = "muted",
}: MixedTextProps) {
  return (
    <View>
      <Text variant={variant} color={boldColor} style={{ fontWeight: "700" }}>
        {boldText}
      </Text>
      <Text variant={variant} color={lightColor} style={{ fontWeight: "300" }}>
        {lightText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
  displayLarge: {
    fontSize: typography.displayLarge.fontSize,
    lineHeight: typography.displayLarge.lineHeight,
    fontWeight: typography.displayLarge.fontWeight,
    letterSpacing: typography.displayLarge.letterSpacing,
  },
  hero: {
    fontSize: typography.hero.fontSize,
    lineHeight: typography.hero.lineHeight,
    fontWeight: typography.hero.fontWeight,
    letterSpacing: typography.hero.letterSpacing,
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
