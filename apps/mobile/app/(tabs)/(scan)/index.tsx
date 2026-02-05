import { ScrollView, Text, View } from "react-native";
import { theme } from "../../../theme";

export default function ScanScreen() {
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
        Scan receipt
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
          Camera & upload
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          We will connect this to Cloudinary and AI extraction next.
        </Text>
      </View>
    </ScrollView>
  );
}
