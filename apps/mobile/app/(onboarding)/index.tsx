import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { BrandMark } from "../../components/onboarding/brand-mark";
import { Hero } from "../../components/onboarding/hero";
import { ReceiptPreviewCard } from "../../components/onboarding/receipt-preview-card";
import { FeatureList } from "../../components/onboarding/feature-list";
import { OnboardingCta } from "../../components/onboarding/cta";
import { theme } from "../../theme";
import { setOnboardingComplete } from "../../lib/storage/onboarding";

export default function OnboardingScreen() {
  const { isSignedIn } = useAuth();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const density =
    height <= 700 ? "compact" : height <= 780 ? "regular" : "spacious";
  const horizontalPadding = width >= 430 ? 40 : width >= 390 ? 32 : 24;
  const contentMaxWidth = 420;
  const topPadding =
    (density === "compact" ? 16 : density === "regular" ? 28 : 48) + insets.top;
  const bottomPadding =
    (density === "compact" ? 16 : density === "regular" ? 24 : 32) +
    insets.bottom;
  const sectionGap =
    density === "compact" ? 18 : density === "regular" ? 24 : 28;
  const groupGap = density === "compact" ? 18 : density === "regular" ? 22 : 28;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: horizontalPadding,
        paddingTop: topPadding,
        paddingBottom: bottomPadding,
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: contentMaxWidth,
          alignSelf: "center",
          justifyContent: "space-between",
          gap: sectionGap,
        }}
      >
        <View style={{ gap: groupGap }}>
          <BrandMark />
          <Hero density={density} />
          <ReceiptPreviewCard density={density} />
          <FeatureList density={density} />
        </View>
        <OnboardingCta
          onPrimaryPress={async () => {
            await setOnboardingComplete(true);
            if (isSignedIn) {
              router.replace("/(tabs)/(home)");
              return;
            }
            router.replace("/(auth)/sign-in");
          }}
          onSecondaryPress={() => {
            setOnboardingComplete(true).then(() => {
              router.replace("/(auth)/sign-in");
            });
          }}
        />
      </View>
    </View>
  );
}
