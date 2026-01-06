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

    const url = `${apiUrl}${endpoint}`;

    // Log the full URL for debugging
    console.log(`[API] Requesting: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          try {
            errorData = await response.json();
          } catch {
            // If JSON parsing fails, try to get text
            const text = await response.text();
            errorData = {
              error: text || `HTTP ${response.status}: ${response.statusText}`,
              code: response.status.toString(),
            };
          }
        } else {
          // Not JSON response
          const text = await response.text();
          errorData = {
            error: text || `HTTP ${response.status}: ${response.statusText}`,
            code: response.status.toString(),
          };
        }

        // For 404 errors, provide a more helpful message
        if (response.status === 404) {
          console.error(`API 404 Error:`, {
            url,
            message:
              "Endpoint not found. Check if EXPO_PUBLIC_API_URL is correct.",
            suggestion:
              "If your Next.js app is at https://billo.sh, set EXPO_PUBLIC_API_URL=https://billo.sh and use /api/ prefix in endpoints",
          });
        } else {
          console.error(`API Error [${response.status}]:`, {
            url,
            status: response.status,
            statusText: response.statusText,
            errorData,
          });
        }

        throw new ApiError(errorData);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        console.warn("Non-JSON response received:", { url, text });
        return text as unknown as T;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      console.error("API Request failed:", {
        url,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new ApiError({
        error:
          error instanceof Error ? error.message : "Network error occurred",
        code: "NETWORK_ERROR",
      });
    }
  };

  return { apiRequest };
}
