import { useState } from "react";
import { TextInput, StyleSheet, View, type TextInputProps } from "react-native";
import { colors, borderRadius, spacing } from "@/constants/theme";
import { Text } from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="small" color="foreground" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <Text variant="small" color="destructive" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs / 2,
    fontWeight: "500",
  },
  input: {
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm, // Refined from full (was pill, now 8px)
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.iconBackground,
    fontSize: 16,
    color: colors.foreground,
  },
  inputFocused: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: colors.destructive,
    backgroundColor: colors.card,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});
