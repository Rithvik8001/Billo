import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text } from "@/components/ui";
import { SignInForm } from "@/components/auth";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function SignInPage() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
            <Text variant="h1" color="foreground" style={styles.title}>
              Welcome back
            </Text>
            <Text variant="bodyLarge" color="muted" style={styles.subtitle}>
              Sign in to continue splitting bills with ease.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <SignInForm />
          </View>

          {/* Sign Up Link */}
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity style={styles.linkSection}>
              <Text variant="body" color="muted">
                Don&apos;t have an account?{" "}
                <Text variant="body" color="primary" style={styles.link}>
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg, // Refined radius
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: spacing.xs,
  },
  formSection: {
    marginBottom: spacing.md,
  },
  linkSection: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
