import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button, Input, Text } from "@/components/ui";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { spacing, colors } from "@/constants/theme";

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setErrors({});
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(
          "Sign-in incomplete:",
          JSON.stringify(signInAttempt, null, 2)
        );
        Alert.alert("Error", "Sign-in process incomplete. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as {
        errors?: { message: string; meta: { fieldName?: string } }[];
      };

      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((e) => {
          if (e.meta?.fieldName === "identifier") {
            fieldErrors.email = e.message;
          } else if (e.meta?.fieldName === "password") {
            fieldErrors.password = e.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert(
          "Error",
          "Failed to sign in. Please check your credentials."
        );
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
        autoComplete="password"
        textContentType="password"
        error={errors.password}
        editable={!loading}
      />
      <Button
        onPress={onSignInPress}
        variant="default"
        size="default"
        fullWidth
        loading={loading}
        disabled={!emailAddress || !password}
      >
        Continue
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
