import { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { Button, Text } from "@/components/ui";
import { spacing, colors, borderRadius } from "@/constants/theme";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    try {
      setLoading(true);
      const redirectUrl = Linking.createURL("/");
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: unknown) {
      const error = err as { errors?: { message: string }[] };
      if (error.errors && Array.isArray(error.errors)) {
        Alert.alert(
          "Error",
          error.errors[0]?.message || "Failed to sign in with Google"
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to sign in with Google. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onPress={onPress}
      variant="social"
      size="default"
      fullWidth
      loading={loading}
      style={styles.button}
      icon={
        <View style={styles.googleIcon}>
          <Text style={styles.googleG}>G</Text>
        </View>
      }
      iconPosition="left"
    >
      Continue with Google
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.sm,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  googleG: {
    color: colors.primaryForeground,
    fontSize: 12,
    fontWeight: "700",
  },
});
