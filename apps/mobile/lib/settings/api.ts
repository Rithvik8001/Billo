import { fetchWithAuth, type TokenProvider } from "../api/client";
import {
  DEFAULT_EMAIL_PREFERENCES,
  DEFAULT_USER_PREFERENCES,
  SUPPORTED_CURRENCIES,
} from "./constants";
import type {
  CurrencyCode,
  EmailPreferenceKey,
  EmailPreferences,
  UserPreferences,
} from "./types";
import { ApiError } from "./types";

const SUPPORTED_CODES = new Set<CurrencyCode>(
  SUPPORTED_CURRENCIES.map((currency) => currency.code),
);

function isCurrencyCode(value: unknown): value is CurrencyCode {
  return (
    typeof value === "string" && SUPPORTED_CODES.has(value as CurrencyCode)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await parseResponseBody(response);
  if (isRecord(body) && typeof body.error === "string") {
    return new ApiError(body.error, response.status);
  }

  return new ApiError(`Request failed (${response.status})`, response.status);
}

function normalizeUserPreferences(body: unknown): UserPreferences {
  if (!isRecord(body) || !isCurrencyCode(body.currencyCode)) {
    return DEFAULT_USER_PREFERENCES;
  }

  return {
    currencyCode: body.currencyCode,
  };
}

function normalizeEmailPreferences(body: unknown): EmailPreferences {
  if (!isRecord(body)) {
    return DEFAULT_EMAIL_PREFERENCES;
  }

  return {
    emailGroupInvites: getBoolean(
      body.emailGroupInvites,
      DEFAULT_EMAIL_PREFERENCES.emailGroupInvites,
    ),
    emailSettlements: getBoolean(
      body.emailSettlements,
      DEFAULT_EMAIL_PREFERENCES.emailSettlements,
    ),
    emailPayments: getBoolean(
      body.emailPayments,
      DEFAULT_EMAIL_PREFERENCES.emailPayments,
    ),
    emailWeeklySummary: getBoolean(
      body.emailWeeklySummary,
      DEFAULT_EMAIL_PREFERENCES.emailWeeklySummary,
    ),
  };
}

export async function getUserPreferences(
  getToken: TokenProvider,
  signal?: AbortSignal,
): Promise<UserPreferences> {
  const response = await fetchWithAuth(
    "/api/users/preferences",
    {
      method: "GET",
      signal,
    },
    getToken,
  );

  if (!response.ok) {
    throw await toApiError(response);
  }

  return normalizeUserPreferences(await parseResponseBody(response));
}

export async function updateUserCurrency(
  currencyCode: CurrencyCode,
  getToken: TokenProvider,
): Promise<UserPreferences> {
  const response = await fetchWithAuth(
    "/api/users/preferences",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currencyCode }),
    },
    getToken,
  );

  if (!response.ok) {
    throw await toApiError(response);
  }

  return normalizeUserPreferences(await parseResponseBody(response));
}

export async function getEmailPreferences(
  getToken: TokenProvider,
  signal?: AbortSignal,
): Promise<EmailPreferences> {
  const response = await fetchWithAuth(
    "/api/users/preferences/email",
    {
      method: "GET",
      signal,
    },
    getToken,
  );

  if (!response.ok) {
    throw await toApiError(response);
  }

  return normalizeEmailPreferences(await parseResponseBody(response));
}

export async function updateEmailPreference(
  key: EmailPreferenceKey,
  value: boolean,
  getToken: TokenProvider,
): Promise<EmailPreferences> {
  const response = await fetchWithAuth(
    "/api/users/preferences/email",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [key]: value }),
    },
    getToken,
  );

  if (!response.ok) {
    throw await toApiError(response);
  }

  return normalizeEmailPreferences(await parseResponseBody(response));
}
