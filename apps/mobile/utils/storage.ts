import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys for the app
 */
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "@billo/onboarding_completed",
  USER_PREFERENCES: "@billo/user_preferences",
} as const;

/**
 * Check if the user has completed onboarding
 * @returns Promise<boolean> - true if onboarding is completed
 */
export async function checkOnboardingStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === "true";
  } catch (error) {
    console.error("Failed to check onboarding status:", error);
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, "true");
  } catch (error) {
    console.error("Failed to save onboarding status:", error);
  }
}

/**
 * Reset onboarding status (for development/testing)
 */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  } catch (error) {
    console.error("Failed to reset onboarding:", error);
  }
}

/**
 * Get a stored value by key
 */
export async function getStoredValue<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Failed to get stored value for ${key}:`, error);
    return null;
  }
}

/**
 * Store a value by key
 */
export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to store value for ${key}:`, error);
  }
}

/**
 * Remove a stored value by key
 */
export async function removeStoredValue(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove value for ${key}:`, error);
  }
}

export { STORAGE_KEYS };
