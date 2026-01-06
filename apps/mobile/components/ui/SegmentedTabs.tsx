import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Text } from "./Text";
import { colors, spacing, borderRadius, animation } from "@/constants/theme";

interface SegmentedTabsProps<T extends string> {
  tabs: Array<{ key: T; label: string }>;
  activeTab: T;
  onTabChange: (tab: T) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: SegmentedTabsProps<T>) {
  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const indicatorPosition = useSharedValue(activeIndex);
  const tabWidth = useSharedValue(0);

  // Update indicator position when active tab changes
  React.useEffect(() => {
    indicatorPosition.value = activeIndex;
  }, [activeIndex, indicatorPosition]);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            indicatorPosition.value * tabWidth.value,
            {
              damping: 20,
              stiffness: 300,
            }
          ),
        },
      ],
      width: `${100 / tabs.length}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={styles.tabsWrapper}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          tabWidth.value = width / tabs.length;
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => {
                indicatorPosition.value = index;
                onTabChange(tab.key);
              }}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                variant="small"
                color={isActive ? "primaryForeground" : "foreground"}
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
        <AnimatedView style={[styles.indicator, indicatorStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: colors.iconBackground,
    borderRadius: borderRadius["2xl"],
    padding: spacing.xs / 2,
    position: "relative",
    height: 36,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.xl,
    zIndex: 1,
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabLabel: {
    fontWeight: "500",
    fontSize: 13,
  },
  tabLabelActive: {
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    top: spacing.xs / 2,
    left: spacing.xs / 2,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    zIndex: 0,
  },
});

