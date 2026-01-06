import { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SignOutButton } from "@/components/auth";
import { SubscriptionCard } from "@/components/account/SubscriptionCard";
import { CurrencySheet } from "@/components/account/CurrencySheet";
import { EmailPreferencesCard } from "@/components/account/EmailPreferencesCard";
import { useCurrency } from "@/hooks/useCurrency";
import { colors, spacing, borderRadius } from "@/constants/theme";
import {
  Settings,
  DollarSign,
  HelpCircle,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react-native";
import { Icon } from "@/components/ui/Icon";

interface SettingsItemProps {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingsItem({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.settingsItem}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Icon icon={icon} size="md" color="foreground" />
      <View style={styles.settingsItemContent}>
        <Text variant="body" color="foreground">
          {label}
        </Text>
        {value && (
          <Text variant="small" color="muted">
            {value}
          </Text>
        )}
      </View>
      {showChevron && <ChevronRight size={20} color={colors.mutedForeground} />}
    </Pressable>
  );
}

export default function AccountTab() {
  const { user } = useUser();
  const { getCurrency } = useCurrency();
  const insets = useSafeAreaInsets();
  const [currencySheetVisible, setCurrencySheetVisible] = useState(false);
  // Tab bar height (60) + safe area bottom + extra padding
  const bottomPadding = 60 + insets.bottom + spacing.xl;

  const currentCurrency = getCurrency();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text variant="h1" color="primaryForeground">
                {user?.firstName?.[0] ||
                  user?.emailAddresses[0]?.emailAddress[0] ||
                  "U"}
              </Text>
            </View>
          )}
          <Text variant="h2" color="foreground" style={styles.userName}>
            {user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`.trim()
              : user?.emailAddresses[0]?.emailAddress || "User"}
          </Text>
          <Text variant="body" color="muted" style={styles.userEmail}>
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              // Edit profile later
            }}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <SubscriptionCard />
        </View>

        {/* Currency Preference */}
        <View style={styles.section}>
          <Card style={styles.settingsCard}>
            <SettingsItem
              icon={DollarSign}
              label="Currency"
              value={`${currentCurrency.symbol} ${currentCurrency.code}`}
              onPress={() => setCurrencySheetVisible(true)}
            />
          </Card>
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <EmailPreferencesCard />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Card style={styles.settingsCard}>
            <SettingsItem
              icon={HelpCircle}
              label="Help & Support"
              onPress={() => {
                // Open help later
              }}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon={FileText}
              label="Terms of Service"
              onPress={() => {
                // Open terms later
              }}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon={Shield}
              label="Privacy Policy"
              onPress={() => {
                // Open privacy later
              }}
            />
            <View style={styles.divider} />
            <SettingsItem
              icon={Settings}
              label="App Version"
              value="1.0.0"
              showChevron={false}
            />
          </Card>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <SignOutButton variant="outline" fullWidth />
        </View>
      </ScrollView>

      <CurrencySheet
        visible={currencySheetVisible}
        onClose={() => setCurrencySheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  userName: {
    marginBottom: spacing.xs / 2,
  },
  userEmail: {
    marginBottom: spacing.md,
  },
  editButton: {
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  settingsCard: {
    padding: 0,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 24 + spacing.md, // Icon + gap
  },
});
