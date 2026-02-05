import { Pressable, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { theme } from "../../../theme";

const sampleReceipts = [
  { id: "r-1001", merchant: "Cafe Terra", total: "$18.40" },
  { id: "r-1002", merchant: "Grocer & Co.", total: "$42.90" },
];

export default function ReceiptsScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
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
          Receipts
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          All scanned and manual receipts in one place.
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {sampleReceipts.map((receipt) => (
          <Link
            key={receipt.id}
            href={`/(tabs)/(receipts)/${receipt.id}`}
            asChild
          >
            <Pressable
              style={{
                borderRadius: theme.radii.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                padding: 16,
                gap: 6,
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
                {receipt.merchant}
              </Text>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.muted,
                }}
              >
                {receipt.total}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
