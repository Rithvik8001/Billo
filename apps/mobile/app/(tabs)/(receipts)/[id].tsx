import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "../../../theme";

export default function ReceiptDetailScreen() {
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
        Receipt details
      </Text>
      <Text
        selectable
        style={{
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.size.small,
          color: theme.colors.muted,
        }}
      >
        Receipt ID: {id}
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
          Items and assignments will appear here.
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          This screen will later show extracted items and split totals.
        </Text>
      </View>
    </ScrollView>
  );
}
