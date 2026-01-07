import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { colors, spacing, borderRadius, animation } from "@/constants/theme";

interface OnboardingPaginationProps {
  total: number;
  currentIndex: SharedValue<number>;
}

export function OnboardingPagination({
  total,
  currentIndex,
}: OnboardingPaginationProps) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {Array.from({ length: total }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          currentIndex={currentIndex}
          total={total}
        />
      ))}
    </View>
  );
}

interface PaginationDotProps {
  index: number;
  currentIndex: SharedValue<number>;
  total: number;
}

function PaginationDot({ index, currentIndex, total }: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;

    const width = withTiming(isActive ? 24 : 8, {
      duration: animation.timing.default,
    });

    const opacity = withTiming(isActive ? 1 : 0.3, {
      duration: animation.timing.default,
    });

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.dot, animatedStyle]}
      accessible
      accessibilityRole="tab"
      accessibilityLabel={`Page ${index + 1} of ${total}`}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.md,
  },
  dot: {
    height: 8,
    backgroundColor: colors.primary, // Navy blue
    borderRadius: borderRadius.full,
  },
});
