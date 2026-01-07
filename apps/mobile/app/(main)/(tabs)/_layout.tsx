import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, iconSizes } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Icon-only navigation
        tabBarActiveTintColor: colors.primary, // Navy blue
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0, // No divider
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + spacing.sm,
          paddingTop: spacing.sm,
          // Clean, no shadow for refined look
        },
        tabBarIconStyle: {
          marginTop: 0, // Center icons vertically
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={iconSizes.md}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarAccessibilityLabel: "Activity tab",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "pulse" : "pulse-outline"}
              size={iconSizes.md}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="receipt"
        options={{
          title: "Receipt",
          tabBarAccessibilityLabel: "Receipt upload tab",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              size={iconSizes.md}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarAccessibilityLabel: "Groups tab",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={iconSizes.md}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarAccessibilityLabel: "Account tab",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={iconSizes.md}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
