import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { Text } from "@/components/ui";
import { spacing } from "@/constants/theme";
import type { IllustrationKey } from "@/types/onboarding";
import {
  ScanIllustration,
  SplitIllustration,
  SettleIllustration,
} from "./illustrations";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingScreenProps {
  /** Slide title */
  title: string;
  /** Slide subtitle/description */
  subtitle: string;
  /** Illustration key to render */
  illustrationKey: IllustrationKey;
  /** Index of this screen */
  index: number;
  /** Current index as shared value */
  currentIndex: SharedValue<number>;
}

const ILLUSTRATION_MAP: Record<IllustrationKey, React.ComponentType> = {
  scan: ScanIllustration,
  split: SplitIllustration,
  settle: SettleIllustration,
};

export function OnboardingScreen({
  title,
  subtitle,
  illustrationKey,
  index,
  currentIndex,
}: OnboardingScreenProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const translateX = interpolate(
      currentIndex.value,
      inputRange,
      [SCREEN_WIDTH * 0.5, 0, -SCREEN_WIDTH * 0.5],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      currentIndex.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      currentIndex.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  const IllustrationComponent = ILLUSTRATION_MAP[illustrationKey];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <IllustrationComponent />
      </View>

      {/* Text content */}
      <View style={styles.textContainer}>
        <Text
          variant="h1"
          color="foreground"
          style={styles.title}
          accessibilityRole="header"
        >
          {title}
        </Text>
        <Text variant="bodyLarge" color="muted" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  textContainer: {
    alignItems: "center",
    paddingBottom: spacing["2xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 24,
  },
});
