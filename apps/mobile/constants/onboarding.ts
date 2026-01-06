import type { OnboardingSlide } from "@/types/onboarding";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "scan",
    title: "Scan receipts instantly",
    subtitle:
      "Snap a photo and let AI extract every item automatically. No manual entry required.",
    illustrationKey: "scan",
  },
  {
    id: "split",
    title: "Split bills fairly",
    subtitle:
      "Tap items to assign to people. See totals update in real-time as you split.",
    illustrationKey: "split",
  },
  {
    id: "settle",
    title: "Settle up easily",
    subtitle:
      "Track who owes what across all your groups. Mark payments complete with one tap.",
    illustrationKey: "settle",
  },
] as const;

export const ONBOARDING_TOTAL_SCREENS = ONBOARDING_SLIDES.length;
