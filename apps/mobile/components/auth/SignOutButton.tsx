import { useState } from "react";
import { Alert } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
}

export function SignOutButton({
  variant = "outline",
  size = "default",
  fullWidth = false,
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await signOut();
              router.replace("/(auth)/sign-in");
            } catch (err) {
              console.error("Error signing out:", err);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Button
      onPress={handleSignOut}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
    >
      Sign Out
    </Button>
  );
}
