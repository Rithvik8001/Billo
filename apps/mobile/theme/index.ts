import { colors, type ThemeColors } from "./colors";
import { spacing, type SpacingScale } from "./spacing";
import { radii, type RadiiScale } from "./radii";
import { typography, type TypographyScale } from "./typography";

export const theme = {
  colors,
  spacing,
  radii,
  typography,
} as const;

export type Theme = {
  colors: ThemeColors;
  spacing: SpacingScale;
  radii: RadiiScale;
  typography: TypographyScale;
};
