import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";
import { spacing } from "@/constants/theme";
import * as WebBrowser from "expo-web-browser";

// Complete the OAuth flow in the browser
WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      if (error.errors && Array.isArray(error.errors)) {
        Alert.alert("Error", error.errors[0]?.message || "Failed to sign in with Google");
      } else {
        Alert.alert("Error", "Failed to sign in with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={onPress}
      variant="outline"
      size="default"
      fullWidth
      loading={loading}
      style={styles.button}
    >
      Continue with Google
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.sm,
  },
});

