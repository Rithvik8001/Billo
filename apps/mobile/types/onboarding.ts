export type IllustrationKey = "scan" | "split" | "settle";

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustrationKey: IllustrationKey;
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
