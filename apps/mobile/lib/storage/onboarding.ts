import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "billo_onboarding_complete";
let cachedValue: boolean | null = null;
const listeners = new Set<(value: boolean) => void>();

export function subscribeOnboardingComplete(
  listener: (value: boolean) => void,
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function getOnboardingComplete(): Promise<boolean> {
  if (cachedValue !== null) {
    return cachedValue;
  }

  const value = await SecureStore.getItemAsync(ONBOARDING_KEY);
  cachedValue = value === "true";
  return cachedValue;
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  cachedValue = value;
  listeners.forEach((listener) => listener(value));
  await SecureStore.setItemAsync(ONBOARDING_KEY, value ? "true" : "false");
}
