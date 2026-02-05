import * as SecureStore from "expo-secure-store";
import type { TokenCache } from "@clerk/clerk-expo";

const TOKEN_KEY = "billo_clerk_token";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(`${TOKEN_KEY}_${key}`);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(`${TOKEN_KEY}_${key}`, token);
    } catch {
      // Ignore write errors; Clerk will fall back to in-memory.
    }
  },
};
