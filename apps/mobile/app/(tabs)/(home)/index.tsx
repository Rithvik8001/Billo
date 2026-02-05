import { Pressable, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { theme } from "../../../theme";

export default function HomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        padding: 24,
        gap: 20,
      }}
    >
      <View style={{ gap: 6 }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: theme.typography.size.title,
            color: theme.colors.foreground,
          }}
        >
          Home
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Overview of your balances and recent activity.
        </Text>
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 12,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Your balance
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: 28,
            color: theme.colors.foreground,
            fontVariant: ["tabular-nums"],
          }}
        >
          $0.00
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Sync receipts to see who owes what.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Quick actions
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.medium,
                color: theme.colors.foreground,
              }}
            >
              Scan receipt
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.medium,
                color: theme.colors.foreground,
              }}
            >
              Manual entry
            </Text>
          </View>
        </View>
      </View>

      <Link href="/(tabs)/(home)/settle" asChild>
        <Pressable>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.small,
              color: theme.colors.foreground,
            }}
          >
            Go to Settle up →
          </Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}
