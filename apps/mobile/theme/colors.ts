export const colors = {
  background: "#FAFAFA",
  surface: "#FFFFFF",
  foreground: "#0A0A0A",
  muted: "#6B7280",
  border: "rgba(0, 0, 0, 0.06)",
  accent: "#0A0A0A",
  subtle: "#F3F4F6",
} as const;

export type ThemeColors = typeof colors;
