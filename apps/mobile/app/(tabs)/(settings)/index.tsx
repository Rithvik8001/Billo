import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { useClerk, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { theme } from "../../../theme";
import { setOnboardingComplete } from "../../../lib/storage/onboarding";

export default function SettingsScreen() {
  const { signOut } = useClerk();
  const { isLoaded, sessionId } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = () => {
    if (isSigningOut) {
      return;
    }

    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            if (!isLoaded || !sessionId) {
              Alert.alert("Sign out unavailable", "Please try again.");
              return;
            }

            setIsSigningOut(true);

            try {
              await signOut({ sessionId });
              await setOnboardingComplete(false);
              router.replace("/(onboarding)");
            } catch (err) {
              const message =
                err && typeof err === "object" && "message" in err
                  ? String((err as { message?: string }).message)
                  : "Unable to sign out right now. Please try again.";
              Alert.alert("Sign out failed", message);
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <View style={{ gap: 6 }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: theme.typography.size.title,
            color: theme.colors.foreground,
          }}
        >
          Settings
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Preferences and account controls.
        </Text>
      </View>
      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 10,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Preferences
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Currency, notifications, and account settings will appear here.
        </Text>
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 10,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Account
        </Text>
        <Pressable onPress={handleSignOut} disabled={isSigningOut}>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.small,
              color: isSigningOut ? theme.colors.muted : "#B42318",
            }}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
