import { Pressable, Text, View } from "react-native";
import { useSSO } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "../../theme";

export function OAuthButtons() {
  const { startSSOFlow } = useSSO();

  const startFlow = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google OAuth failed", error);
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Pressable
        accessibilityRole="button"
        onPress={startFlow}
        style={({ pressed }) => ({
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          paddingVertical: 12,
          paddingHorizontal: 14,
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <FontAwesome name="google" size={18} color="#4285F4" />
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.small,
            color: theme.colors.foreground,
          }}
        >
          Continue with Google
        </Text>
      </Pressable>
    </View>
  );
}
