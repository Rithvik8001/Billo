export interface OnboardingFeature {
  icon: string; // Lucide icon name
  text: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  iconName: string; // Lucide icon name
  features: OnboardingFeature[];
}

export interface OnboardingState {
  currentIndex: number;
  hasCompleted: boolean;
}

export type OnboardingNavigationAction =
  | "next"
  | "previous"
  | "skip"
  | "complete";
