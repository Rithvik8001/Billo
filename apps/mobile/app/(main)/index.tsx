import { Redirect } from "expo-router";

export default function IndexScreen() {
  // Redirect to home tab
  return <Redirect href="/(main)/(tabs)/home" />;
}
