import { View, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Text } from "@/components/ui/Text";
import { colors, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ReceiptTab() {
  const insets = useSafeAreaInsets();
  
  // Tab bar height (70) + safe area bottom + extra padding
  const bottomPadding = 70 + insets.bottom + spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="camera" size={80} color={colors.mutedForeground} />
        </View>
        <Text variant="h2" color="foreground" style={styles.title}>
          Receipt Upload
        </Text>
        <Text variant="body" color="muted" style={styles.description}>
          This is where receipt scanning and upload functionality will be implemented.
        </Text>
        <Text variant="small" color="muted" style={styles.note}>
          Coming soon: Camera integration, image picker, and AI processing
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.iconBackgroundLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  note: {
    textAlign: "center",
    fontStyle: "italic",
  },
});

