export type OnboardingFeature = {
  id: string;
  title: string;
  description: string;
};

export const onboardingFeatures: OnboardingFeature[] = [
  {
    id: "scan",
    title: "Scan receipts instantly",
    description: "Capture a receipt and let AI extract items in seconds.",
  },
  {
    id: "assign",
    title: "Tap to split",
    description: "Assign items to friends with a clean, precise flow.",
  },
  {
    id: "settle",
    title: "Settle without friction",
    description: "Track who owes what and close the loop quickly.",
  },
];
