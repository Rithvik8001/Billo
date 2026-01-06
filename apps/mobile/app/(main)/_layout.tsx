import { Stack } from "expo-router";
import { colors } from "@/constants/theme";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen
        name="group/[id]"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
}
