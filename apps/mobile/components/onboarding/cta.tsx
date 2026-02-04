import { View } from "react-native";
import { PrimaryButton } from "../ui/primary-button";
import { SecondaryButton } from "../ui/secondary-button";

export type OnboardingCtaProps = {
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
};

export function OnboardingCta({
  onPrimaryPress,
  onSecondaryPress,
}: OnboardingCtaProps) {
  return (
    <View style={{ gap: 12 }}>
      <PrimaryButton label="Get started" onPress={onPrimaryPress} />
      <SecondaryButton
        label="I already have an account"
        onPress={onSecondaryPress}
      />
    </View>
  );
}
