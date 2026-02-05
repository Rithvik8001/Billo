import { Pressable, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { theme } from "../../../theme";

const sampleGroups = [
  { id: "g-101", name: "Weekend trip" },
  { id: "g-102", name: "Roommates" },
];

export default function GroupsScreen() {
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
        Groups
      </Text>

      <View style={{ gap: 12 }}>
        {sampleGroups.map((group) => (
          <Link key={group.id} href={`/(tabs)/(groups)/${group.id}`} asChild>
            <Pressable
              style={{
                borderRadius: theme.radii.lg,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                padding: 16,
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
                {group.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
