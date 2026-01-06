import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button, Input, Text } from "@/components/ui";
import { spacing } from "@/constants/theme";

interface VerificationFormProps {
  emailAddress: string;
}

export function VerificationForm({ emailAddress }: VerificationFormProps) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setError(undefined);
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Verification incomplete:",
          JSON.stringify(completeSignUp, null, 2)
        );
        Alert.alert("Error", "Verification incomplete. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      if (error.errors && Array.isArray(error.errors)) {
        setError(error.errors[0]?.message || "Invalid verification code");
      } else {
        setError("Failed to verify email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onPressResend = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Verification code sent to your email.");
    } catch {
      Alert.alert("Error", "Failed to resend verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="body" color="muted" style={styles.description}>
        We&apos;ve sent a verification code to {emailAddress}
      </Text>
      <Input
        label="Verification Code"
        value={code}
        placeholder="Enter verification code"
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        error={error}
        editable={!loading}
      />
      <Button
        onPress={onPressVerify}
        variant="default"
        size="default"
        fullWidth
        loading={loading}
        disabled={!code || code.length < 6}
      >
        Verify Email
      </Button>
      <Button
        onPress={onPressResend}
        variant="ghost"
        size="default"
        fullWidth
        style={styles.resendButton}
      >
        Resend Code
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  description: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  resendButton: {
    marginTop: spacing.sm,
  },
});
