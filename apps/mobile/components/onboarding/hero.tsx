import { Text, View } from "react-native";
import { theme } from "../../theme";

export type HeroProps = {
  density?: "compact" | "regular" | "spacious";
};

export function Hero({ density = "regular" }: HeroProps) {
  const displaySize =
    density === "compact" ? 30 : density === "regular" ? 32 : 34;
  const displayLineHeight =
    density === "compact" ? 36 : density === "regular" ? 38 : 40;
  const bodySize = density === "compact" ? 15 : theme.typography.size.body;
  const bodyLineHeight =
    density === "compact" ? 20 : theme.typography.lineHeight.body;

  return (
    <View style={{ gap: 12 }}>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.semibold,
          fontSize: displaySize,
          lineHeight: displayLineHeight,
          color: theme.colors.foreground,
          letterSpacing: theme.typography.letterSpacing.tight,
        }}
      >
        Split bills with calm clarity.
      </Text>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: bodySize,
          lineHeight: bodyLineHeight,
          color: theme.colors.muted,
          letterSpacing: theme.typography.letterSpacing.normal,
        }}
      >
        Scan receipts, assign items, and settle up without spreadsheets.
      </Text>
    </View>
  );
}
