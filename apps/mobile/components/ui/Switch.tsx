import { Switch as RNSwitch, StyleSheet, Platform } from "react-native";
import { colors } from "@/constants/theme";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: colors.iconBackground,
        true: colors.primary,
      }}
      thumbColor={Platform.OS === "ios" ? undefined : colors.primaryForeground}
      ios_backgroundColor={colors.iconBackground}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    />
  );
}

