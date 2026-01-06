import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, iconSizes, shadows } from "@/constants/theme";
import { Home, Activity, Users, User } from "lucide-react-native";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + spacing.sm,
          paddingTop: spacing.sm,
          ...shadows.md,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          letterSpacing: 0.6,
          textTransform: "uppercase",
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
          tabBarIcon: ({ color, size }) => (
            <Home size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color, size }) => (
            <Activity size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, size }) => (
            <Users size={iconSizes.md} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <User size={iconSizes.md} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
