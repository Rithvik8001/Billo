import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
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
    return maybeErrors?.[0]?.message || "Sign in failed.";
  }

  return "Sign in failed.";
}

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
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
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/(home)");
      } else {
        setError("Additional verification is required.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue splitting with Billo."
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
            New here?
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.foreground,
                }}
              >
                Create account
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
          placeholder="••••••••"
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
          label={isSubmitting ? "Signing in..." : "Continue"}
          onPress={handleSubmit}
          disabled={isSubmitting || !email || !password}
        />
      </View>

      <View style={{ gap: 12 }}>
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.border,
          }}
        />
        <OAuthButtons />
      </View>
    </AuthLayout>
  );
}
