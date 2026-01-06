import { View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { colors, spacing } from "@/constants/theme";
import { useEmailPreferences } from "@/hooks/useEmailPreferences";
import { Alert } from "react-native";

export function EmailPreferencesCard() {
  const { preferences, isLoading, updatePreference } = useEmailPreferences();

  const handleToggle = async (
    key: keyof typeof preferences,
    value: boolean
  ) => {
    try {
      await updatePreference(key, value);
    } catch (error) {
      Alert.alert("Error", "Failed to update email preference. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Card style={styles.card}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color="muted">
            Loading email preferences...
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3" color="foreground" style={styles.title}>
          Email Notifications
        </Text>
        <Text variant="small" color="muted" style={styles.description}>
          Choose which email notifications you want to receive
        </Text>
      </View>

      <View style={styles.preferences}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Text variant="body" color="foreground" style={styles.preferenceLabel}>
              Group Invitations
            </Text>
            <Text variant="small" color="muted" style={styles.preferenceDescription}>
              When you're added to a group
            </Text>
          </View>
          <Switch
            value={preferences.emailGroupInvites}
            onValueChange={(value) => handleToggle("emailGroupInvites", value)}
            accessibilityLabel="Group Invitations"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Text variant="body" color="foreground" style={styles.preferenceLabel}>
              New Settlements
            </Text>
            <Text variant="small" color="muted" style={styles.preferenceDescription}>
              When you owe or are owed money
            </Text>
          </View>
          <Switch
            value={preferences.emailSettlements}
            onValueChange={(value) => handleToggle("emailSettlements", value)}
            accessibilityLabel="New Settlements"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Text variant="body" color="foreground" style={styles.preferenceLabel}>
              Payment Confirmations
            </Text>
            <Text variant="small" color="muted" style={styles.preferenceDescription}>
              When settlements are marked as paid
            </Text>
          </View>
          <Switch
            value={preferences.emailPayments}
            onValueChange={(value) => handleToggle("emailPayments", value)}
            accessibilityLabel="Payment Confirmations"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Text variant="body" color="foreground" style={styles.preferenceLabel}>
              Weekly Summary
            </Text>
            <Text variant="small" color="muted" style={styles.preferenceDescription}>
              Monday digest of pending settlements
            </Text>
          </View>
          <Switch
            value={preferences.emailWeeklySummary}
            onValueChange={(value) => handleToggle("emailWeeklySummary", value)}
            accessibilityLabel="Weekly Summary"
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs / 2,
  },
  description: {
    marginTop: spacing.xs / 2,
  },
  preferences: {
    gap: 0,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  preferenceContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  preferenceLabel: {
    marginBottom: spacing.xs / 2,
  },
  preferenceDescription: {
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 0,
  },
});

