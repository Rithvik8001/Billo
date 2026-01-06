import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Button, Input, Text } from "@/components/ui";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { spacing, colors } from "@/constants/theme";

interface SignUpFormProps {
  onVerificationNeeded: (email: string) => void;
}

export function SignUpForm({ onVerificationNeeded }: SignUpFormProps) {
  const { signUp, isLoaded } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setErrors({});
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      onVerificationNeeded(emailAddress);
    } catch (err: unknown) {
      const error = err as {
        errors?: { message: string; meta: { fieldName?: string } }[];
      };

      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((e) => {
          if (e.meta?.fieldName === "email_address") {
            fieldErrors.email = e.message;
          } else if (e.meta?.fieldName === "password") {
            fieldErrors.password = e.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        error={errors.email}
        editable={!loading}
      />
      <Input
        label="Password"
        value={password}
        placeholder="Enter password"
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password-new"
        textContentType="newPassword"
        error={errors.password}
        editable={!loading}
      />
      <Button
        onPress={onSignUpPress}
        variant="default"
        size="default"
        fullWidth
        loading={loading}
        disabled={!emailAddress || !password}
      >
        Create Account
      </Button>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleSignInButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 14,
    color: colors.mutedForeground,
  },
});
