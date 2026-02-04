export const typography = {
  fontFamily: {
    regular: "Sora_400Regular",
    medium: "Sora_500Medium",
    semibold: "Sora_600SemiBold",
  },
  size: {
    display: 34,
    title: 22,
    body: 16,
    small: 13,
  },
  lineHeight: {
    display: 40,
    title: 28,
    body: 22,
    small: 18,
  },
  letterSpacing: {
    tight: -0.6,
    normal: -0.2,
  },
} as const;

export type TypographyScale = typeof typography;
