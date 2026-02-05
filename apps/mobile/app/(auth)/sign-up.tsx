import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { AuthLayout } from "../../components/auth/auth-layout";
import { AuthInput } from "../../components/auth/auth-input";
import { AuthButton } from "../../components/auth/auth-button";
import { OAuthButtons } from "../../components/auth/oauth-buttons";
import { theme } from "../../theme";

function getErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "errors" in error) {
    const maybeErrors = (error as { errors?: Array<{ message: string }> }).errors;
    return maybeErrors?.[0]?.message || "Sign up failed.";
  }

  return "Sign up failed.";
}

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isLoaded) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.replace({
        pathname: "/(auth)/verify-email",
        params: { email: email.trim() },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start splitting receipts in minutes."
      footer={
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: theme.colors.muted,
            }}
          >
            Already have an account?
          </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.foreground,
                }}
              >
                Sign in
              </Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      <View style={{ gap: 16 }}>
        <AuthInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@domain.com"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 8 characters"
          secureTextEntry
          textContentType="password"
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
          label={isSubmitting ? "Creating..." : "Create account"}
          onPress={handleSubmit}
          disabled={isSubmitting || !email || !password}
        />
      </View>

      <View style={{ gap: 12 }}>
        <View style={{ height: 1, backgroundColor: theme.colors.border }} />
        <OAuthButtons />
      </View>
    </AuthLayout>
  );
}
