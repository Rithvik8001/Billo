import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import { theme } from "../../theme";

export default function TabLayout() {
  return (
    <NativeTabs tintColor={theme.colors.foreground}>
      <NativeTabs.Trigger name="(home)">
        <Label>Home</Label>
        <Icon sf={{ default: "house", selected: "house.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(scan)">
        <Label>Scan</Label>
        <Icon sf={{ default: "camera", selected: "camera.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(receipts)">
        <Label>Receipts</Label>
        <Icon sf={{ default: "doc.plaintext", selected: "doc.plaintext" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(groups)">
        <Label>Groups</Label>
        <Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <Label>Settings</Label>
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
