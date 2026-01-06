import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { checkOnboardingStatus } from "@/utils/storage";
import { colors } from "@/constants/theme";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
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
    if (isLoading || hasSeenOnboarding === null) return;

    const inOnboarding = segments[0] === "(onboarding)";
    const inMain = segments[0] === "(main)";

    if (!hasSeenOnboarding && !inOnboarding) {
      router.replace("/(onboarding)");
    } else if (hasSeenOnboarding && inOnboarding) {
      router.replace("/(main)");
    } else if (hasSeenOnboarding && !inMain && !inOnboarding) {
      router.replace("/(main)");
    } else if (!hasSeenOnboarding && !inOnboarding) {
      router.replace("/(onboarding)");
    }
  }, [isLoading, hasSeenOnboarding, segments, router]);

  if (isLoading) {
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
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(main)" />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
