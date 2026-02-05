import { Text, TextInput, View } from "react-native";
import { theme } from "../../theme";

export type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  textContentType?: "emailAddress" | "password" | "oneTimeCode";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
};

export function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  textContentType,
  autoCapitalize = "none",
  maxLength,
}: AuthInputProps) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.size.small,
          color: theme.colors.foreground,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        maxLength={maxLength}
        style={{
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingVertical: 12,
          paddingHorizontal: 14,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.size.body,
          color: theme.colors.foreground,
          backgroundColor: theme.colors.surface,
        }}
      />
    </View>
  );
}
