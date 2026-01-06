import { useState, useCallback } from "react";
import { View, StyleSheet, Platform, AccessibilityInfo } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { withSpring } from "react-native-reanimated";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ONBOARDING_SLIDES } from "@/constants/onboarding";
import { colors, spacing, animation } from "@/constants/theme";
import {
  OnboardingScreen,
  OnboardingPagination,
  OnboardingButton,
  SkipButton,
} from "@/components/onboarding";
import { scheduleOnRN } from "react-native-worklets";

export default function OnboardingPage() {
  const [isCompleting, setIsCompleting] = useState(false);

  const {
    currentIndex,
    goToNext,
    completeOnboarding,
    skipOnboarding,
    getCurrentIndex,
    totalScreens,
  } = useOnboarding();

  const announceScreenChange = useCallback(
    (index: number) => {
      if (Platform.OS === "ios") {
        const slide = ONBOARDING_SLIDES[index];
        AccessibilityInfo.announceForAccessibility(
          `Screen ${index + 1} of ${totalScreens}: ${slide.title}`
        );
      }
    },
    [totalScreens]
  );

  const handleNext = useCallback(() => {
    const index = getCurrentIndex();
    if (index < totalScreens - 1) {
      goToNext();
      announceScreenChange(index + 1);
    } else {
      setIsCompleting(true);
      completeOnboarding().finally(() => setIsCompleting(false));
    }
  }, [
    getCurrentIndex,
    totalScreens,
    goToNext,
    completeOnboarding,
    announceScreenChange,
  ]);

  const handleSkip = useCallback(() => {
    setIsCompleting(true);
    skipOnboarding().finally(() => setIsCompleting(false));
  }, [skipOnboarding]);

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const SWIPE_THRESHOLD = 50;

    if (event.translationX < -SWIPE_THRESHOLD) {
      const index = Math.round(currentIndex.value);
      if (index < totalScreens - 1) {
        currentIndex.value = withSpring(index + 1, animation.spring.default);
        scheduleOnRN(() => announceScreenChange(index + 1));
      }
    } else if (event.translationX > SWIPE_THRESHOLD) {
      const index = Math.round(currentIndex.value);
      if (index > 0) {
        currentIndex.value = withSpring(index - 1, animation.spring.default);
        scheduleOnRN(() => announceScreenChange(index - 1));
      }
    }
  });

  const isLastScreen = getCurrentIndex() === totalScreens - 1;

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <SkipButton onPress={handleSkip} />

        <GestureDetector gesture={swipeGesture}>
          <View style={styles.screensContainer}>
            {ONBOARDING_SLIDES.map((slide, index) => (
              <OnboardingScreen
                key={slide.id}
                slide={slide}
                index={index}
                currentIndex={currentIndex}
              />
            ))}
          </View>
        </GestureDetector>

        <View style={styles.bottomSection}>
          <View style={styles.paginationContainer}>
            <OnboardingPagination
              total={totalScreens}
              currentIndex={currentIndex}
            />
          </View>

          <OnboardingButton
            isLastScreen={isLastScreen}
            onPress={handleNext}
            loading={isCompleting}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screensContainer: {
    flex: 1,
    position: "relative",
  },
  bottomSection: {
    paddingBottom: spacing.lg,
  },
  paginationContainer: {
    paddingBottom: spacing.sm,
  },
});
