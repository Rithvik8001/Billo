import { useCallback, useMemo } from "react";
import {
  useSharedValue,
  withSpring,
  runOnJS,
  type SharedValue,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ONBOARDING_SLIDES } from "@/constants/onboarding";
import { setOnboardingCompleted } from "@/utils/storage";
import { animation } from "@/constants/theme";

export interface UseOnboardingReturn {
  /** Current slide index as a shared value for animations */
  currentIndex: SharedValue<number>;
  /** Navigate to next slide */
  goToNext: () => void;
  /** Navigate to previous slide */
  goToPrevious: () => void;
  /** Navigate to a specific slide */
  goToIndex: (index: number) => void;
  /** Mark onboarding as complete and navigate to main app */
  completeOnboarding: () => Promise<void>;
  /** Skip onboarding and go to main app */
  skipOnboarding: () => Promise<void>;
  /** Whether current slide is the first */
  isFirstScreen: boolean;
  /** Whether current slide is the last */
  isLastScreen: boolean;
  /** Total number of slides */
  totalScreens: number;
  /** Get current index value (for JS thread) */
  getCurrentIndex: () => number;
}

export function useOnboarding(): UseOnboardingReturn {
  const router = useRouter();
  const currentIndex = useSharedValue(0);
  const totalScreens = ONBOARDING_SLIDES.length;

  const springConfig = animation.spring.default;

  const goToNext = useCallback(() => {
    "worklet";
    if (currentIndex.value < totalScreens - 1) {
      currentIndex.value = withSpring(currentIndex.value + 1, springConfig);
    }
  }, [currentIndex, totalScreens, springConfig]);

  const goToPrevious = useCallback(() => {
    "worklet";
    if (currentIndex.value > 0) {
      currentIndex.value = withSpring(currentIndex.value - 1, springConfig);
    }
  }, [currentIndex, springConfig]);

  const goToIndex = useCallback(
    (index: number) => {
      "worklet";
      if (index >= 0 && index < totalScreens) {
        currentIndex.value = withSpring(index, springConfig);
      }
    },
    [currentIndex, totalScreens, springConfig]
  );

  const navigateToMain = useCallback(() => {
    router.replace("/(main)");
  }, [router]);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingCompleted();
    navigateToMain();
  }, [navigateToMain]);

  const skipOnboarding = useCallback(async () => {
    await setOnboardingCompleted();
    navigateToMain();
  }, [navigateToMain]);

  const getCurrentIndex = useCallback(() => {
    return Math.round(currentIndex.value);
  }, [currentIndex]);

  // These need to be computed on JS thread for conditional rendering
  const isFirstScreen = useMemo(() => {
    // This will be re-evaluated when getCurrentIndex changes
    return getCurrentIndex() === 0;
  }, [getCurrentIndex]);

  const isLastScreen = useMemo(() => {
    return getCurrentIndex() === totalScreens - 1;
  }, [getCurrentIndex, totalScreens]);

  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToIndex,
    completeOnboarding,
    skipOnboarding,
    isFirstScreen,
    isLastScreen,
    totalScreens,
    getCurrentIndex,
  };
}
