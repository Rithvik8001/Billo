import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect, Line, G, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { colors } from "@/constants/theme";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const ILLUSTRATION_SIZE = 280;
const RECEIPT_WIDTH = 160;
const RECEIPT_HEIGHT = 200;

export function ScanIllustration() {
  const scanProgress = useSharedValue(0);
  const itemOpacity1 = useSharedValue(0);
  const itemOpacity2 = useSharedValue(0);
  const itemOpacity3 = useSharedValue(0);

  useEffect(() => {
    // Animate scan line
    scanProgress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Animate items appearing with stagger
    itemOpacity1.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withDelay(1600, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );
    itemOpacity2.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withDelay(1600, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );
    itemOpacity3.value = withDelay(
      1100,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withDelay(1600, withTiming(0, { duration: 400 }))
        ),
        -1
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanLineProps = useAnimatedProps(() => {
    const y = interpolate(
      scanProgress.value,
      [0, 1],
      [40, RECEIPT_HEIGHT - 20]
    );
    return {
      y1: y,
      y2: y,
    };
  });

  const item1Props = useAnimatedProps(() => ({
    opacity: itemOpacity1.value,
  }));

  const item2Props = useAnimatedProps(() => ({
    opacity: itemOpacity2.value,
  }));

  const item3Props = useAnimatedProps(() => ({
    opacity: itemOpacity3.value,
  }));

  const receiptX = (ILLUSTRATION_SIZE - RECEIPT_WIDTH) / 2;
  const receiptY = (ILLUSTRATION_SIZE - RECEIPT_HEIGHT) / 2;

  return (
    <View style={styles.container}>
      <Svg
        width={ILLUSTRATION_SIZE}
        height={ILLUSTRATION_SIZE}
        viewBox={`0 0 ${ILLUSTRATION_SIZE} ${ILLUSTRATION_SIZE}`}
      >
        {/* Receipt background */}
        <Rect
          x={receiptX}
          y={receiptY}
          width={RECEIPT_WIDTH}
          height={RECEIPT_HEIGHT}
          rx={12}
          fill={colors.card}
          stroke={colors.border}
          strokeWidth={1}
        />

        {/* Receipt header line */}
        <Rect
          x={receiptX + 20}
          y={receiptY + 20}
          width={RECEIPT_WIDTH - 40}
          height={8}
          rx={4}
          fill={colors.mutedForeground}
          opacity={0.3}
        />

        {/* Static item lines (placeholders) */}
        <Rect
          x={receiptX + 20}
          y={receiptY + 50}
          width={100}
          height={6}
          rx={3}
          fill={colors.muted}
        />
        <Rect
          x={receiptX + 20}
          y={receiptY + 70}
          width={80}
          height={6}
          rx={3}
          fill={colors.muted}
        />
        <Rect
          x={receiptX + 20}
          y={receiptY + 90}
          width={90}
          height={6}
          rx={3}
          fill={colors.muted}
        />

        {/* Animated extracted items (appear after scan) */}
        <AnimatedRect
          animatedProps={item1Props}
          x={receiptX + 20}
          y={receiptY + 50}
          width={100}
          height={6}
          rx={3}
          fill={colors.accent}
        />
        <AnimatedRect
          animatedProps={item2Props}
          x={receiptX + 20}
          y={receiptY + 70}
          width={80}
          height={6}
          rx={3}
          fill={colors.accent}
        />
        <AnimatedRect
          animatedProps={item3Props}
          x={receiptX + 20}
          y={receiptY + 90}
          width={90}
          height={6}
          rx={3}
          fill={colors.accent}
        />

        {/* Total line */}
        <Rect
          x={receiptX + 20}
          y={receiptY + 130}
          width={60}
          height={6}
          rx={3}
          fill={colors.mutedForeground}
          opacity={0.5}
        />
        <Rect
          x={receiptX + RECEIPT_WIDTH - 60}
          y={receiptY + 130}
          width={40}
          height={6}
          rx={3}
          fill={colors.foreground}
        />

        {/* Divider line */}
        <Line
          x1={receiptX + 20}
          y1={receiptY + 120}
          x2={receiptX + RECEIPT_WIDTH - 20}
          y2={receiptY + 120}
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* Animated scan line */}
        <AnimatedLine
          animatedProps={scanLineProps}
          x1={receiptX + 10}
          x2={receiptX + RECEIPT_WIDTH - 10}
          stroke={colors.accent}
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Camera frame corners */}
        <G stroke={colors.foreground} strokeWidth={3} strokeLinecap="round">
          {/* Top-left */}
          <Line
            x1={receiptX - 20}
            y1={receiptY - 10}
            x2={receiptX - 20}
            y2={receiptY - 25}
          />
          <Line
            x1={receiptX - 20}
            y1={receiptY - 25}
            x2={receiptX - 5}
            y2={receiptY - 25}
          />

          {/* Top-right */}
          <Line
            x1={receiptX + RECEIPT_WIDTH + 20}
            y1={receiptY - 10}
            x2={receiptX + RECEIPT_WIDTH + 20}
            y2={receiptY - 25}
          />
          <Line
            x1={receiptX + RECEIPT_WIDTH + 20}
            y1={receiptY - 25}
            x2={receiptX + RECEIPT_WIDTH + 5}
            y2={receiptY - 25}
          />

          {/* Bottom-left */}
          <Line
            x1={receiptX - 20}
            y1={receiptY + RECEIPT_HEIGHT + 10}
            x2={receiptX - 20}
            y2={receiptY + RECEIPT_HEIGHT + 25}
          />
          <Line
            x1={receiptX - 20}
            y1={receiptY + RECEIPT_HEIGHT + 25}
            x2={receiptX - 5}
            y2={receiptY + RECEIPT_HEIGHT + 25}
          />

          {/* Bottom-right */}
          <Line
            x1={receiptX + RECEIPT_WIDTH + 20}
            y1={receiptY + RECEIPT_HEIGHT + 10}
            x2={receiptX + RECEIPT_WIDTH + 20}
            y2={receiptY + RECEIPT_HEIGHT + 25}
          />
          <Line
            x1={receiptX + RECEIPT_WIDTH + 20}
            y1={receiptY + RECEIPT_HEIGHT + 25}
            x2={receiptX + RECEIPT_WIDTH + 5}
            y2={receiptY + RECEIPT_HEIGHT + 25}
          />
        </G>

        {/* Scan indicator dot */}
        <Circle
          cx={receiptX + RECEIPT_WIDTH + 30}
          cy={receiptY - 15}
          r={6}
          fill={colors.accent}
        />
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
