import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthLayout } from "../../components/auth/auth-layout";
import { AuthInput } from "../../components/auth/auth-input";
import { AuthButton } from "../../components/auth/auth-button";
import { theme } from "../../theme";

function getErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "errors" in error) {
    const maybeErrors = (error as { errors?: Array<{ message: string }> }).errors;
    return maybeErrors?.[0]?.message || "Verification failed.";
  }

  return "Verification failed.";
}

export default function VerifyEmailScreen() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!isLoaded) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/(home)");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) {
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "Enter the 6-digit code to continue."
      }
    >
      <View style={{ gap: 16 }}>
        <AuthInput
          label="Verification code"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={6}
        />
        {error ? (
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: "#B42318",
            }}
          >
            {error}
          </Text>
        ) : null}
        <AuthButton
          label={isSubmitting ? "Verifying..." : "Verify"}
          onPress={handleVerify}
          disabled={isSubmitting || code.length < 6}
        />
        <Pressable onPress={handleResend} disabled={isResending}>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.small,
              color: theme.colors.foreground,
              opacity: isResending ? 0.6 : 1,
            }}
          >
            {isResending ? "Resending..." : "Resend code"}
          </Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}
