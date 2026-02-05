import { ScrollView, Text, View } from "react-native";
import { theme } from "../../../theme";

export default function SettleScreen() {
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
        Settle up
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
          No settlements yet
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Once receipts are split, balances will appear here.
        </Text>
      </View>
    </ScrollView>
  );
}
