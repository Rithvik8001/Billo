import { Text, View } from "react-native";
import { theme } from "../../theme";

export type ReceiptPreviewCardProps = {
  density?: "compact" | "regular" | "spacious";
};

export function ReceiptPreviewCard({
  density = "regular",
}: ReceiptPreviewCardProps) {
  const padding = density === "compact" ? 14 : density === "regular" ? 16 : 18;
  const sectionGap = density === "compact" ? 10 : density === "regular" ? 12 : 14;
  const lineHeight = density === "compact" ? 8 : 10;

  return (
    <View
      style={{
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        gap: sectionGap,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ gap: 6 }}>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.body,
              color: theme.colors.foreground,
            }}
          >
            Grocer & Co.
          </Text>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: theme.colors.muted,
            }}
          >
            Today, 6:41 PM
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.subtle,
          }}
        >
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.small,
              color: theme.colors.foreground,
            }}
          >
            $42.90
          </Text>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <View
          style={{
            height: lineHeight,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.subtle,
            width: "86%",
          }}
        />
        <View
          style={{
            height: lineHeight,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.subtle,
            width: "72%",
          }}
        />
        <View
          style={{
            height: lineHeight,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.subtle,
            width: "64%",
          }}
        />
        <View
          style={{
            height: lineHeight,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors.subtle,
            width: "78%",
          }}
        />
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.border,
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Split between 3
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          $14.30 each
        </Text>
      </View>
    </View>
  );
}
