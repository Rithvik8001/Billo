import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "../../../theme";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.semibold,
          fontSize: theme.typography.size.title,
          color: theme.colors.foreground,
        }}
      >
        Group details
      </Text>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.size.small,
          color: theme.colors.muted,
        }}
      >
        Group ID: {id}
      </Text>
      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 10,
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
          Members and balances will live here.
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          This screen will show group members, receipts, and settle info.
        </Text>
      </View>
    </ScrollView>
  );
}
