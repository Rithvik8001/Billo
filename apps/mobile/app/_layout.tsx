import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
} from "@expo-google-fonts/sora";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "../lib/storage/auth";
import {
  getOnboardingComplete,
  subscribeOnboardingComplete,
} from "../lib/storage/onboarding";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_500Medium,
    Sora_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your env.",
    );
  }
  const appEnv =
    process.env.EXPO_PUBLIC_APP_ENV ?? (__DEV__ ? "development" : "production");

  if (appEnv === "production" && publishableKey.startsWith("pk_test")) {
    throw new Error(
      "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is a test key in production. Set a live key (pk_live_...) in .env.production.",
    );
  }

  if (appEnv === "development" && publishableKey.startsWith("pk_live")) {
    console.warn(
      "Clerk publishable key is live in development. Use a test key to avoid touching production data.",
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator />
    </ClerkProvider>
  );
}

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    let active = true;
    getOnboardingComplete()
      .then((value) => {
        if (active) {
          setHasCompletedOnboarding(value);
        }
      })
      .catch(() => {
        if (active) {
          setHasCompletedOnboarding(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeOnboardingComplete((value) => {
      setHasCompletedOnboarding(value);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isLoaded || hasCompletedOnboarding === null) {
      return;
    }

    const [rootSegment] = segments;
    const inOnboarding = rootSegment === "(onboarding)";
    const inAuth = rootSegment === "(auth)";
    const inTabs = rootSegment === "(tabs)";

    if (!isSignedIn && inTabs) {
      router.replace("/(onboarding)");
      return;
    }

    if (!hasCompletedOnboarding && inAuth) {
      router.replace("/(onboarding)");
      return;
    }

    if (isSignedIn && !inTabs) {
      router.replace("/(tabs)/(home)");
    }
  }, [hasCompletedOnboarding, isLoaded, isSignedIn, router, segments]);

  if (!isLoaded || hasCompletedOnboarding === null) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
