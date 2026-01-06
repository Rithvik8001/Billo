import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { checkOnboardingStatus } from "@/utils/storage";
import { colors } from "@/constants/theme";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables"
  );
}

function RootLayoutNav() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const completed = await checkOnboardingStatus();
        setHasSeenOnboarding(completed);
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
        setHasSeenOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isLoaded || isLoading || hasSeenOnboarding === null) return;

    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inMain = segments[0] === "(main)";

    // Not signed in: show onboarding first, then auth
    if (!isSignedIn) {
      if (inAuth) {
        // User is on auth screen, allow it
        return;
      }
      // Not signed in and not on auth: show onboarding
      if (!inOnboarding) {
        router.replace("/(onboarding)");
      }
      return;
    }

    // Signed in: check onboarding
    if (isSignedIn) {
      if (inAuth) {
        // Already signed in, redirect away from auth screens
        if (!hasSeenOnboarding) {
          router.replace("/(onboarding)");
        } else {
          router.replace("/(main)");
        }
        return;
      }

      if (!hasSeenOnboarding && !inOnboarding) {
        router.replace("/(onboarding)");
      } else if (hasSeenOnboarding && inOnboarding) {
        router.replace("/(main)");
      } else if (hasSeenOnboarding && !inMain && !inOnboarding && !inAuth) {
        router.replace("/(main)");
      }
    }
  }, [isLoaded, isSignedIn, isLoading, hasSeenOnboarding, segments, router]);

  if (!isLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.foreground} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <RootLayoutNav />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
