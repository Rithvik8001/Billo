import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

/**
 * Root index screen - shows loading while _layout.tsx handles navigation
 * The root layout checks onboarding status and redirects accordingly
 */
export default function Index() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.foreground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
