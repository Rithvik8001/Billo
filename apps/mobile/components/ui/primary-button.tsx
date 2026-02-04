import { Pressable, Text, ViewStyle } from "react-native";
import { theme } from "../../theme";

export type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  label,
  onPress,
  style,
  accessibilityLabel,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.accent,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}
    >
      <Text
        selectable
        style={{
          color: theme.colors.surface,
          fontFamily: theme.typography.fontFamily.semibold,
          fontSize: theme.typography.size.body,
          letterSpacing: theme.typography.letterSpacing.normal,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
