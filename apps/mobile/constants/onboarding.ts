import type { OnboardingSlide } from "@/types/onboarding";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "scan",
    title: "Scan receipts instantly",
    subtitle:
      "Snap a photo and let AI extract every item automatically. No manual entry required.",
    iconName: "Camera",
    features: [
      { icon: "Zap", text: "AI-powered extraction" },
      { icon: "Clock", text: "Instant processing" },
      { icon: "CheckCircle", text: "100% accurate" },
    ],
  },
  {
    id: "split",
    title: "Split bills fairly",
    subtitle:
      "Tap items to assign to people. See totals update in real-time as you split.",
    iconName: "Users",
    features: [
      { icon: "UserPlus", text: "Add friends easily" },
      { icon: "Calculator", text: "Auto-calculate totals" },
      { icon: "RefreshCw", text: "Real-time updates" },
    ],
  },
  {
    id: "settle",
    title: "Settle up easily",
    subtitle:
      "Track who owes what across all your groups. Mark payments complete with one tap.",
    iconName: "Wallet",
    features: [
      { icon: "DollarSign", text: "Track balances" },
      { icon: "CheckCircle2", text: "Mark as paid" },
      { icon: "TrendingUp", text: "View history" },
    ],
  },
] as const;

export const ONBOARDING_TOTAL_SCREENS = ONBOARDING_SLIDES.length;
