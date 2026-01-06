import { useAuth } from "@clerk/clerk-expo";

export class ApiError extends Error {
  constructor(
    public response: { error: string; code?: string; details?: unknown },
    message?: string
  ) {
    super(message || response.error);
    this.name = "ApiError";
  }
}

export function useApiClient() {
  const { getToken } = useAuth();

  const apiRequest = async <T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> => {
    const token = await getToken();
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "";

    if (!apiUrl) {
      throw new Error("EXPO_PUBLIC_API_URL is not set");
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "An error occurred",
        code: response.status.toString(),
      }));
      throw new ApiError(errorData);
    }

    return response.json();
  };

  return { apiRequest };
}
