import { Pressable, Text, ViewStyle } from "react-native";
import { theme } from "../../theme";

export type AuthButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AuthButton({
  label,
  onPress,
  disabled,
  style,
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          height: 52,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.foreground,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.semibold,
          fontSize: theme.typography.size.body,
          color: theme.colors.surface,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
