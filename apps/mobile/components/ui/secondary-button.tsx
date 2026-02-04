import { Pressable, Text, ViewStyle } from "react-native";
import { theme } from "../../theme";

export type SecondaryButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function SecondaryButton({
  label,
  onPress,
  style,
  accessibilityLabel,
}: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 10,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        selectable
        style={{
          color: theme.colors.muted,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.size.small,
          letterSpacing: theme.typography.letterSpacing.normal,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
