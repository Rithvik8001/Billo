/**
 * Design tokens matching the web app's design system
 * Reference: apps/web/app/globals.css
 */

export const colors = {
  // Core colors
  background: '#FAFAFA',
  foreground: '#0A0A0A',
  card: '#FFFFFF',
  cardForeground: '#0A0A0A',

  // Primary
  primary: '#0A0A0A',
  primaryHover: '#1A1A1A',
  primaryForeground: '#FFFFFF',

  // Secondary & Muted
  secondary: '#F9FAFB',
  secondaryForeground: '#0A0A0A',
  muted: '#F9FAFB',
  mutedForeground: '#6B7280',

  // Accent
  accent: '#3B82F6',
  accentForeground: '#0A0A0A',

  // Borders
  border: 'rgba(0, 0, 0, 0.06)',
  input: 'rgba(0, 0, 0, 0.08)',
  ring: '#3B82F6',

  // Destructive
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',

  // Gradients (for premium buttons)
  gradientStart: '#1A1A1A',
  gradientEnd: '#0A0A0A',

  // Icon backgrounds
  iconBackground: '#F3F4F6',
  iconBackgroundLight: '#F9FAFB',
} as const;

export const typography = {
  display: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: '600' as const,
    letterSpacing: -1.92, // -0.04em * 48
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: -0.96, // -0.03em * 32
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.72, // -0.03em * 24
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500' as const,
    letterSpacing: -0.36, // -0.02em * 18
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.6, // 0.05em * 12
    textTransform: 'uppercase' as const,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const borderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
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

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const iconSizes = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
  '3xl': 96,
} as const;

// Type exports for type safety
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Animation = typeof animation;
export type Shadows = typeof shadows;
export type IconSizes = typeof iconSizes;
