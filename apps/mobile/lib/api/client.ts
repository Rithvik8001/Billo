export type TokenProvider = () => Promise<string | null>;

const baseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  getToken?: TokenProvider,
) {
  const token = getToken ? await getToken() : null;
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });
}
