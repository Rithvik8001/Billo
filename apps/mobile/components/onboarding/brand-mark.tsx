import { Text, View } from "react-native";
import { theme } from "../../theme";

export function BrandMark() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.foreground,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.surface,
          }}
        />
      </View>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.semibold,
          fontSize: theme.typography.size.title,
          color: theme.colors.foreground,
          letterSpacing: theme.typography.letterSpacing.normal,
        }}
      >
        Billo
      </Text>
    </View>
  );
}
