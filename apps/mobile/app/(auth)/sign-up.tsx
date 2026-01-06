import { useState } from "react";
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
import { SignUpForm, VerificationForm } from "@/components/auth";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function SignUpPage() {
  const [showVerification, setShowVerification] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const handleVerificationNeeded = (email: string) => {
    setEmailAddress(email);
    setShowVerification(true);
  };

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
              {showVerification ? "Verify your email" : "Create your account"}
            </Text>
            <Text variant="bodyLarge" color="muted" style={styles.subtitle}>
              {showVerification
                ? "Enter the code we sent to your email"
                : "Join thousands who make bill splitting effortless."}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {showVerification ? (
              <VerificationForm emailAddress={emailAddress} />
            ) : (
              <SignUpForm onVerificationNeeded={handleVerificationNeeded} />
            )}
          </View>

          {/* Sign In Link */}
          {!showVerification && (
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity style={styles.linkSection}>
                <Text variant="body" color="muted">
                  Already have an account?{" "}
                  <Text variant="body" color="accent" style={styles.link}>
                    Sign in
                  </Text>
                </Text>
              </TouchableOpacity>
            </Link>
          )}
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
    borderRadius: borderRadius["2xl"],
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
