import { Text, View } from "react-native";
import { onboardingFeatures } from "../../data/onboarding-features";
import { theme } from "../../theme";

export type FeatureListProps = {
  density?: "compact" | "regular" | "spacious";
};

export function FeatureList({ density = "regular" }: FeatureListProps) {
  const listGap = density === "compact" ? 12 : density === "regular" ? 14 : 16;
  const descriptionLineHeight =
    density === "compact"
      ? theme.typography.lineHeight.small - 2
      : theme.typography.lineHeight.small;

  return (
    <View style={{ gap: listGap }}>
      {onboardingFeatures.map((feature) => (
        <View
          key={feature.id}
          style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: theme.radii.pill,
              marginTop: 8,
              backgroundColor: theme.colors.foreground,
            }}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.size.body,
                color: theme.colors.foreground,
              }}
            >
              {feature.title}
            </Text>
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.size.small,
                lineHeight: descriptionLineHeight,
                color: theme.colors.muted,
              }}
            >
              {feature.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
