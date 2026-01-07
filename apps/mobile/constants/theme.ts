export const colors = {
  background: "#FAFAFA",
  foreground: "#0A0A0A",
  card: "#FFFFFF",
  cardForeground: "#0A0A0A",

  // Primary - Deep Navy Blue
  primary: "#1E3A8A",
  primaryLight: "#3B82F6",
  primaryMuted: "#60A5FA",
  primaryBackground: "#EFF6FF",
  primaryForeground: "#FFFFFF",

  secondary: "#F9FAFB",
  secondaryForeground: "#0A0A0A",
  muted: "#F9FAFB",
  mutedForeground: "#6B7280",

  accent: "#3B82F6",
  accentForeground: "#0A0A0A",

  border: "rgba(0, 0, 0, 0.06)",
  borderStrong: "rgba(0, 0, 0, 0.12)",
  input: "rgba(0, 0, 0, 0.08)",
  ring: "#3B82F6",

  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",

  success: "#22C55E",
  successForeground: "#FFFFFF",
  warning: "#F59E0B",
  warningForeground: "#FFFFFF",

  // Gradients - Navy blue gradient
  gradientStart: "#1E3A8A",
  gradientEnd: "#2563EB",

  iconBackground: "#F3F4F6",
  iconBackgroundLight: "#F9FAFB",
} as const;

export const typography = {
  // New: Extra large display for hero amounts
  displayLarge: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "700" as const,
    letterSpacing: -2.0,
  },
  // New: Hero text for featured headlines
  hero: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "700" as const,
    letterSpacing: -1.2,
  },
  display: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "600" as const,
    letterSpacing: -1.92,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const, // Bolder
    letterSpacing: -0.96,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.72,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const, // Slightly bolder
    letterSpacing: -0.36,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
  },
} as const;

export const spacing = {
  "2xs": 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
  "4xl": 80,
  "5xl": 96,
} as const;

// Reduced, refined border radius (no more excessive pill shapes)
export const borderRadius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999, // Keep for avatars only
} as const;

export const animation = {
  spring: {
    default: { damping: 30, stiffness: 300 },
    fast: { damping: 25, stiffness: 400 },
    gentle: { damping: 20, stiffness: 200 },
    bouncy: { damping: 15, stiffness: 300 },
  },
  timing: {
    fast: 150,
    default: 250,
    slow: 400,
  },
} as const;

// Enhanced navy-tinted shadows for premium depth
export const shadows = {
  sm: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  lg: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  button: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 5,
  },
  // New: For floating elements (FAB, elevated cards)
  elevated: {
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const iconSizes = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 96,
} as const;

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Animation = typeof animation;
export type Shadows = typeof shadows;
export type IconSizes = typeof iconSizes;
