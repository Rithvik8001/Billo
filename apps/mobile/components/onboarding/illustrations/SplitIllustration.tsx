import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect, Circle, Line, G, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { colors } from "@/constants/theme";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ILLUSTRATION_SIZE = 280;

// Avatar positions
const AVATARS = [
  { x: 60, y: 140, initial: "A", color: "#3B82F6" },
  { x: 140, y: 200, initial: "B", color: "#10B981" },
  { x: 220, y: 140, initial: "C", color: "#F59E0B" },
];

// Item card positions
const ITEMS = [
  { x: 100, y: 60, width: 80 },
  { x: 140, y: 90, width: 70 },
  { x: 110, y: 120, width: 60 },
];

export function SplitIllustration() {
  const lineProgress1 = useSharedValue(0);
  const lineProgress2 = useSharedValue(0);
  const lineProgress3 = useSharedValue(0);
  const tapRipple = useSharedValue(0);

  useEffect(() => {
    // Animate connection lines with stagger
    lineProgress1.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
          withDelay(2000, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );

    lineProgress2.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
          withDelay(2000, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );

    lineProgress3.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
          withDelay(2000, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );

    // Tap ripple animation
    tapRipple.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 200 })
      ),
      -1
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Line from item 1 to avatar A
  const line1Props = useAnimatedProps(() => {
    const endX = interpolate(
      lineProgress1.value,
      [0, 1],
      [ITEMS[0].x + 40, AVATARS[0].x]
    );
    const endY = interpolate(
      lineProgress1.value,
      [0, 1],
      [ITEMS[0].y + 10, AVATARS[0].y - 20]
    );
    return {
      x2: endX,
      y2: endY,
      opacity: lineProgress1.value,
    };
  });

  // Line from item 2 to avatar B
  const line2Props = useAnimatedProps(() => {
    const endX = interpolate(
      lineProgress2.value,
      [0, 1],
      [ITEMS[1].x + 35, AVATARS[1].x]
    );
    const endY = interpolate(
      lineProgress2.value,
      [0, 1],
      [ITEMS[1].y + 10, AVATARS[1].y - 20]
    );
    return {
      x2: endX,
      y2: endY,
      opacity: lineProgress2.value,
    };
  });

  // Line from item 3 to avatar C
  const line3Props = useAnimatedProps(() => {
    const endX = interpolate(
      lineProgress3.value,
      [0, 1],
      [ITEMS[2].x + 30, AVATARS[2].x]
    );
    const endY = interpolate(
      lineProgress3.value,
      [0, 1],
      [ITEMS[2].y + 10, AVATARS[2].y - 20]
    );
    return {
      x2: endX,
      y2: endY,
      opacity: lineProgress3.value,
    };
  });

  // Tap ripple effect
  const rippleProps = useAnimatedProps(() => {
    const scale = interpolate(tapRipple.value, [0, 1], [1, 2]);
    const opacity = interpolate(tapRipple.value, [0, 0.5, 1], [0.5, 0.3, 0]);
    return {
      r: 15 * scale,
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Svg
        width={ILLUSTRATION_SIZE}
        height={ILLUSTRATION_SIZE}
        viewBox={`0 0 ${ILLUSTRATION_SIZE} ${ILLUSTRATION_SIZE}`}
      >
        {/* Item cards */}
        {ITEMS.map((item, index) => (
          <G key={`item-${index}`}>
            <Rect
              x={item.x}
              y={item.y}
              width={item.width}
              height={20}
              rx={6}
              fill={colors.card}
              stroke={colors.border}
              strokeWidth={1}
            />
            <Rect
              x={item.x + 8}
              y={item.y + 7}
              width={item.width - 30}
              height={6}
              rx={3}
              fill={colors.mutedForeground}
              opacity={0.4}
            />
            <Rect
              x={item.x + item.width - 18}
              y={item.y + 7}
              width={12}
              height={6}
              rx={3}
              fill={colors.foreground}
            />
          </G>
        ))}

        {/* Connection lines (dashed, animated) */}
        <AnimatedLine
          animatedProps={line1Props}
          x1={ITEMS[0].x + 40}
          y1={ITEMS[0].y + 10}
          stroke={AVATARS[0].color}
          strokeWidth={2}
          strokeDasharray="4,4"
          strokeLinecap="round"
        />
        <AnimatedLine
          animatedProps={line2Props}
          x1={ITEMS[1].x + 35}
          y1={ITEMS[1].y + 10}
          stroke={AVATARS[1].color}
          strokeWidth={2}
          strokeDasharray="4,4"
          strokeLinecap="round"
        />
        <AnimatedLine
          animatedProps={line3Props}
          x1={ITEMS[2].x + 30}
          y1={ITEMS[2].y + 10}
          stroke={AVATARS[2].color}
          strokeWidth={2}
          strokeDasharray="4,4"
          strokeLinecap="round"
        />

        {/* User avatars */}
        {AVATARS.map((avatar, index) => (
          <G key={`avatar-${index}`}>
            <Circle
              cx={avatar.x}
              cy={avatar.y}
              r={24}
              fill={avatar.color}
              opacity={0.15}
            />
            <Circle cx={avatar.x} cy={avatar.y} r={20} fill={avatar.color} />
            <SvgText
              x={avatar.x}
              y={avatar.y + 6}
              fontSize={14}
              fontWeight="600"
              fill="white"
              textAnchor="middle"
            >
              {avatar.initial}
            </SvgText>
          </G>
        ))}

        {/* Tap indicator with ripple */}
        <G>
          <AnimatedCircle
            animatedProps={rippleProps}
            cx={ITEMS[1].x + 35}
            cy={ITEMS[1].y + 10}
            fill={colors.accent}
          />
          {/* Hand/finger indicator */}
          <Circle
            cx={ITEMS[1].x + 45}
            cy={ITEMS[1].y + 35}
            r={8}
            fill={colors.foreground}
            opacity={0.8}
          />
          <Rect
            x={ITEMS[1].x + 41}
            y={ITEMS[1].y + 35}
            width={8}
            height={16}
            rx={4}
            fill={colors.foreground}
            opacity={0.8}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
