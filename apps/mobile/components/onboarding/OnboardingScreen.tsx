import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { Text, Icon, Card } from "@/components/ui";
import { spacing, colors, borderRadius } from "@/constants/theme";
import type { OnboardingSlide } from "@/types/onboarding";
import * as LucideIcons from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingScreenProps {
  slide: OnboardingSlide;
  index: number;
  currentIndex: SharedValue<number>;
}

export function OnboardingScreen({
  slide,
  index,
  currentIndex,
}: OnboardingScreenProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];

    const translateX = interpolate(
      currentIndex.value,
      inputRange,
      [SCREEN_WIDTH, 0, -SCREEN_WIDTH],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      currentIndex.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  const IconComponent =
    (LucideIcons as Record<string, React.ComponentType<any>>)[slide.iconName] ||
    LucideIcons.Circle;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Icon
              icon={IconComponent}
              size="lg"
              color="primary"
              background
              backgroundVariant="light"
            />
          </View>
          <Text variant="h1" color="foreground" style={styles.title}>
            {slide.title}
          </Text>
          <Text variant="bodyLarge" color="muted" style={styles.subtitle}>
            {slide.subtitle}
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {slide.features.map((feature, featureIndex) => {
            const FeatureIconComponent =
              (LucideIcons as Record<string, React.ComponentType<any>>)[
                feature.icon
              ] || LucideIcons.Circle;

            return (
              <Card key={featureIndex} style={styles.featureCard}>
                <View style={styles.featureContent}>
                  <View style={styles.featureIconWrapper}>
                    <Icon
                      icon={FeatureIconComponent}
                      size="md"
                      color="foreground"
                    />
                  </View>
                  <View style={styles.featureTextWrapper}>
                    <Text variant="body" color="foreground" style={styles.featureText}>
                      {feature.text}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing["2xl"],
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  iconWrapper: {
    marginBottom: spacing.lg,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.sm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.mutedForeground,
  },
  featuresContainer: {
    gap: spacing.md,
  },
  featureCard: {
    padding: spacing.lg,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md, // Refined radius
    backgroundColor: colors.primaryBackground, // Navy blue tint
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
});
