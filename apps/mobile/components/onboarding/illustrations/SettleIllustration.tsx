import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Rect,
  Circle,
  Line,
  G,
  Path,
  Text as SvgText,
} from "react-native-svg";
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

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ILLUSTRATION_SIZE = 280;
const CARD_WIDTH = 100;
const CARD_HEIGHT = 70;

export function SettleIllustration() {
  const checkmarkProgress = useSharedValue(0);

  useEffect(() => {
    // Checkmark animation (draw in, then reset)
    checkmarkProgress.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
          withDelay(2000, withTiming(0, { duration: 300 }))
        ),
        -1
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Checkmark path animation
  const checkmarkProps = useAnimatedProps(() => {
    const dashOffset = interpolate(checkmarkProgress.value, [0, 1], [30, 0]);
    return {
      strokeDashoffset: dashOffset,
      opacity: checkmarkProgress.value,
    };
  });

  const card1X = (ILLUSTRATION_SIZE - CARD_WIDTH * 2 - 20) / 2;
  const card2X = card1X + CARD_WIDTH + 20;
  const cardY = 80;

  return (
    <View style={styles.container}>
      <Svg
        width={ILLUSTRATION_SIZE}
        height={ILLUSTRATION_SIZE}
        viewBox={`0 0 ${ILLUSTRATION_SIZE} ${ILLUSTRATION_SIZE}`}
      >
        {/* "You owe" card */}
        <G>
          <Rect
            x={card1X}
            y={cardY}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            rx={12}
            fill={colors.card}
            stroke={colors.border}
            strokeWidth={1}
          />
          {/* Label */}
          <Rect
            x={card1X + 12}
            y={cardY + 12}
            width={45}
            height={6}
            rx={3}
            fill={colors.mutedForeground}
            opacity={0.4}
          />
          {/* Amount */}
          <SvgText
            x={card1X + 12}
            y={cardY + 45}
            fontSize={18}
            fontWeight="600"
            fill={colors.destructive}
          >
            $24.50
          </SvgText>
        </G>

        {/* "You're owed" card */}
        <G>
          <Rect
            x={card2X}
            y={cardY}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            rx={12}
            fill={colors.card}
            stroke={colors.border}
            strokeWidth={1}
          />
          {/* Label */}
          <Rect
            x={card2X + 12}
            y={cardY + 12}
            width={55}
            height={6}
            rx={3}
            fill={colors.mutedForeground}
            opacity={0.4}
          />
          {/* Amount */}
          <SvgText
            x={card2X + 12}
            y={cardY + 45}
            fontSize={18}
            fontWeight="600"
            fill={colors.success}
          >
            $42.00
          </SvgText>
        </G>

        {/* Settlement card with checkmark */}
        <G>
          <Rect
            x={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2}
            y={cardY + CARD_HEIGHT + 30}
            width={CARD_WIDTH + 20}
            height={50}
            rx={10}
            fill={colors.muted}
            stroke={colors.border}
            strokeWidth={1}
          />

          {/* User avatars */}
          <Circle
            cx={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 25}
            cy={cardY + CARD_HEIGHT + 55}
            r={14}
            fill="#3B82F6"
          />
          <SvgText
            x={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 25}
            y={cardY + CARD_HEIGHT + 60}
            fontSize={10}
            fontWeight="600"
            fill="white"
            textAnchor="middle"
          >
            A
          </SvgText>

          {/* Arrow */}
          <Line
            x1={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 45}
            y1={cardY + CARD_HEIGHT + 55}
            x2={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 75}
            y2={cardY + CARD_HEIGHT + 55}
            stroke={colors.mutedForeground}
            strokeWidth={2}
          />
          <Path
            d={`M ${(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 70} ${
              cardY + CARD_HEIGHT + 50
            } L ${(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 75} ${
              cardY + CARD_HEIGHT + 55
            } L ${(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + 70} ${
              cardY + CARD_HEIGHT + 60
            }`}
            stroke={colors.mutedForeground}
            strokeWidth={2}
            fill="none"
          />

          <Circle
            cx={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + CARD_WIDTH - 5}
            cy={cardY + CARD_HEIGHT + 55}
            r={14}
            fill="#10B981"
          />
          <SvgText
            x={(ILLUSTRATION_SIZE - CARD_WIDTH - 20) / 2 + CARD_WIDTH - 5}
            y={cardY + CARD_HEIGHT + 60}
            fontSize={10}
            fontWeight="600"
            fill="white"
            textAnchor="middle"
          >
            B
          </SvgText>
        </G>

        {/* Animated checkmark in circle */}
        <G>
          <Circle
            cx={ILLUSTRATION_SIZE / 2}
            cy={cardY + CARD_HEIGHT + 110}
            r={24}
            fill={colors.success}
            opacity={0.15}
          />
          <Circle
            cx={ILLUSTRATION_SIZE / 2}
            cy={cardY + CARD_HEIGHT + 110}
            r={18}
            fill={colors.success}
          />
          <AnimatedPath
            animatedProps={checkmarkProps}
            d={`M ${ILLUSTRATION_SIZE / 2 - 8} ${cardY + CARD_HEIGHT + 110} L ${
              ILLUSTRATION_SIZE / 2 - 2
            } ${cardY + CARD_HEIGHT + 116} L ${ILLUSTRATION_SIZE / 2 + 8} ${
              cardY + CARD_HEIGHT + 104
            }`}
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={30}
          />
        </G>

        {/* Group indicator at top */}
        <G>
          <Circle
            cx={ILLUSTRATION_SIZE / 2 - 20}
            cy={40}
            r={16}
            fill={colors.muted}
            stroke={colors.border}
            strokeWidth={1}
          />
          <Circle
            cx={ILLUSTRATION_SIZE / 2}
            cy={40}
            r={16}
            fill={colors.muted}
            stroke={colors.border}
            strokeWidth={1}
          />
          <Circle
            cx={ILLUSTRATION_SIZE / 2 + 20}
            cy={40}
            r={16}
            fill={colors.muted}
            stroke={colors.border}
            strokeWidth={1}
          />
          {/* User icon in center circle */}
          <Circle
            cx={ILLUSTRATION_SIZE / 2}
            cy={38}
            r={5}
            fill={colors.mutedForeground}
          />
          <Path
            d={`M ${ILLUSTRATION_SIZE / 2 - 8} ${48} Q ${
              ILLUSTRATION_SIZE / 2
            } ${42} ${ILLUSTRATION_SIZE / 2 + 8} ${48}`}
            stroke={colors.mutedForeground}
            strokeWidth={2}
            fill="none"
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
