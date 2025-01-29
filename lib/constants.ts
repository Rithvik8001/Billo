export const colors = {
  primary: {
    50: "#f5f5f7",
    100: "#e8e8ed",
    200: "#d2d2d7",
    300: "#86868b",
    400: "#6e6e73",
    500: "#1d1d1f",
    600: "#000000",
  },
  accent: {
    blue: "#2997ff",
    indigo: "#5856d6",
    purple: "#bf4800",
    pink: "#ff2d55",
  },
  gray: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
} as const;

export const theme = {
  background: {
    primary: "#000000",
    secondary: "#1d1d1f",
    elevated: "rgba(255, 255, 255, 0.04)",
  },
  text: {
    primary: "#f5f5f7",
    secondary: "#86868b",
    accent: "#2997ff",
  },
  border: {
    default: "rgba(255, 255, 255, 0.1)",
    hover: "rgba(255, 255, 255, 0.2)",
  },
  blur: {
    background: "rgba(0, 0, 0, 0.8)",
  },
} as const;
