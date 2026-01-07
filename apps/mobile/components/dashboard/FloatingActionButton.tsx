import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/Icon";
import { colors, spacing, borderRadius, shadows, animation } from "@/constants/theme";
import { Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({
  onPress,
}: FloatingActionButtonProps) {
  const pressed = useSharedValue(false);
  const insets = useSafeAreaInsets();
  // Tab bar height (60) + safe area bottom + spacing
  const bottomOffset = 60 + insets.bottom + spacing.lg;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(pressed.value ? 0.95 : 1, {
          duration: animation.timing.fast,
        }),
      },
    ],
    bottom: bottomOffset,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      style={[styles.fab, animatedStyle]}
      onPress={handlePress}
      onPressIn={() => {
        pressed.value = true;
      }}
      onPressOut={() => {
        pressed.value = false;
      }}
      accessibilityLabel="Add expense"
      accessibilityRole="button"
    >
      <Icon
        icon={Plus}
        size="lg"
        color="primaryForeground"
        customSize={24}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary, // Navy blue
    alignItems: "center",
    justifyContent: "center",
    ...shadows.elevated, // Enhanced depth
    zIndex: 1000,
  },
});

