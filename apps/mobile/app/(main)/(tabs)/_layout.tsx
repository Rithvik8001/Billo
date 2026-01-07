import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, iconSizes } from "@/constants/theme";
import { Home, Activity, Users, User } from "lucide-react-native";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // Navy blue
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + spacing.sm,
          paddingTop: spacing.sm,
          // Clean, no shadow for refined look
        },
        tabBarLabelStyle: {
          fontSize: 11, // Slightly smaller
          fontWeight: "500",
        },
        tabBarIconStyle: {
          marginTop: spacing.xs / 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <Activity size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => (
            <Users size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <User size={iconSizes.md} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
