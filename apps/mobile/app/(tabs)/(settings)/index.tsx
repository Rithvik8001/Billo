import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useAuth, useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { theme } from "../../../theme";
import { setOnboardingComplete } from "../../../lib/storage/onboarding";
import {
  DEFAULT_EMAIL_PREFERENCES,
  SUPPORTED_CURRENCIES,
} from "../../../lib/settings/constants";
import {
  getEmailPreferences,
  getUserPreferences,
  updateEmailPreference,
  updateUserCurrency,
} from "../../../lib/settings/api";
import {
  ApiError,
  type CurrencyCode,
  type EmailPreferenceKey,
  type EmailPreferences,
} from "../../../lib/settings/types";

const EMAIL_ROWS: {
  key: EmailPreferenceKey;
  title: string;
  description: string;
}[] = [
  {
    key: "emailGroupInvites",
    title: "Group Invitations",
    description: "When you're added to a group",
  },
  {
    key: "emailSettlements",
    title: "New Settlements",
    description: "When you owe or are owed money",
  },
  {
    key: "emailPayments",
    title: "Payment Confirmations",
    description: "When settlements are marked as paid",
  },
  {
    key: "emailWeeklySummary",
    title: "Weekly Summary",
    description: "Monday digest of pending settlements",
  },
];

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function toDisplayError(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Session expired. Please sign in again.";
    }

    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function getCurrencyPreview(currencyCode: CurrencyCode): string {
  const selectedCurrency =
    SUPPORTED_CURRENCIES.find((currency) => currency.code === currencyCode) ??
    SUPPORTED_CURRENCIES[0];

  return `${selectedCurrency.symbol}1234.56`;
}

export default function SettingsScreen() {
  const { signOut } = useClerk();
  const { isLoaded, sessionId, getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [savedCurrency, setSavedCurrency] = useState<CurrencyCode>("USD");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");
  const [isCurrencyListOpen, setIsCurrencyListOpen] = useState(false);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(true);
  const [isSavingCurrency, setIsSavingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState<string | null>(null);
  const [currencySaveError, setCurrencySaveError] = useState<string | null>(
    null,
  );

  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>(
    DEFAULT_EMAIL_PREFERENCES,
  );
  const [isEmailLoading, setIsEmailLoading] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailFieldErrors, setEmailFieldErrors] = useState<
    Partial<Record<EmailPreferenceKey, string>>
  >({});
  const [updatingEmailFields, setUpdatingEmailFields] = useState<
    Partial<Record<EmailPreferenceKey, boolean>>
  >({});

  const selectedCurrencyOption = useMemo(() => {
    return (
      SUPPORTED_CURRENCIES.find(
        (currency) => currency.code === selectedCurrency,
      ) ?? SUPPORTED_CURRENCIES[0]
    );
  }, [selectedCurrency]);

  const canSaveCurrency =
    !isCurrencyLoading &&
    !isSavingCurrency &&
    selectedCurrency !== savedCurrency;

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  const getAuthToken = useCallback(async () => {
    if (!isLoaded) {
      return null;
    }

    return (await getTokenRef.current()) ?? null;
  }, [isLoaded]);

  const loadCurrency = useCallback(
    async (signal?: AbortSignal) => {
      setIsCurrencyLoading(true);
      setCurrencyError(null);
      setCurrencySaveError(null);

      try {
        const preferences = await getUserPreferences(getAuthToken, signal);
        setSavedCurrency(preferences.currencyCode);
        setSelectedCurrency(preferences.currencyCode);
      } catch (error) {
        if (!isAbortError(error)) {
          setCurrencyError(
            toDisplayError(error, "Failed to load currency preference."),
          );
        }
      } finally {
        if (!signal?.aborted) {
          setIsCurrencyLoading(false);
        }
      }
    },
    [getAuthToken],
  );

  const loadEmail = useCallback(
    async (signal?: AbortSignal) => {
      setIsEmailLoading(true);
      setEmailError(null);
      setEmailFieldErrors({});

      try {
        const preferences = await getEmailPreferences(getAuthToken, signal);
        setEmailPreferences(preferences);
      } catch (error) {
        if (!isAbortError(error)) {
          setEmailError(
            toDisplayError(error, "Failed to load email preferences."),
          );
        }
      } finally {
        if (!signal?.aborted) {
          setIsEmailLoading(false);
        }
      }
    },
    [getAuthToken],
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const controller = new AbortController();
    void Promise.all([
      loadCurrency(controller.signal),
      loadEmail(controller.signal),
    ]);

    return () => {
      controller.abort();
    };
  }, [isLoaded, loadCurrency, loadEmail]);

  const handleSaveCurrency = async () => {
    if (!canSaveCurrency) {
      return;
    }

    setIsSavingCurrency(true);
    setCurrencySaveError(null);

    try {
      const updatedPreferences = await updateUserCurrency(
        selectedCurrency,
        getAuthToken,
      );
      setSavedCurrency(updatedPreferences.currencyCode);
      setSelectedCurrency(updatedPreferences.currencyCode);
      setIsCurrencyListOpen(false);
    } catch (error) {
      setCurrencySaveError(
        toDisplayError(error, "Failed to save currency preference."),
      );
    } finally {
      setIsSavingCurrency(false);
    }
  };

  const handleEmailToggle = async (key: EmailPreferenceKey, value: boolean) => {
    setEmailFieldErrors((current) => ({ ...current, [key]: undefined }));
    setUpdatingEmailFields((current) => ({ ...current, [key]: true }));

    try {
      const updatedPreferences = await updateEmailPreference(
        key,
        value,
        getAuthToken,
      );
      setEmailPreferences(updatedPreferences);
    } catch (error) {
      setEmailFieldErrors((current) => ({
        ...current,
        [key]: toDisplayError(error, "Failed to update preference."),
      }));
    } finally {
      setUpdatingEmailFields((current) => ({ ...current, [key]: false }));
    }
  };

  const handleSignOut = () => {
    if (isSigningOut) {
      return;
    }

    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            if (!isLoaded || !sessionId) {
              Alert.alert("Sign out unavailable", "Please try again.");
              return;
            }

            setIsSigningOut(true);

            try {
              await signOut({ sessionId });
              await setOnboardingComplete(false);
              router.replace("/(onboarding)");
            } catch (error) {
              const message = toDisplayError(
                error,
                "Unable to sign out right now. Please try again.",
              );
              Alert.alert("Sign out failed", message);
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      <View style={{ gap: 6 }}>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.semibold,
            fontSize: theme.typography.size.title,
            color: theme.colors.foreground,
          }}
        >
          Settings
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Manage your account preferences.
        </Text>
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 12,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Currency Preference
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Choose your preferred currency for displaying amounts.
        </Text>

        {isCurrencyLoading ? (
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: theme.colors.muted,
            }}
          >
            Loading currency preference...
          </Text>
        ) : currencyError ? (
          <View style={{ gap: 8 }}>
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.size.small,
                color: "#B42318",
              }}
            >
              {currencyError}
            </Text>
            <Pressable onPress={() => void loadCurrency()}>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.foreground,
                }}
              >
                Retry
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => setIsCurrencyListOpen((open) => !open)}
              style={{
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: theme.colors.background,
              }}
            >
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.foreground,
                }}
              >
                {selectedCurrencyOption.symbol} {selectedCurrencyOption.name} (
                {selectedCurrencyOption.code})
              </Text>
            </Pressable>

            {isCurrencyListOpen ? (
              <View
                style={{
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  overflow: "hidden",
                }}
              >
                {SUPPORTED_CURRENCIES.map((currency) => {
                  const isSelected = selectedCurrency === currency.code;
                  return (
                    <Pressable
                      key={currency.code}
                      onPress={() => setSelectedCurrency(currency.code)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderTopWidth: currency.code === "USD" ? 0 : 1,
                        borderTopColor: theme.colors.border,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: theme.colors.surface,
                      }}
                    >
                      <Text
                        selectable
                        style={{
                          fontFamily: theme.typography.fontFamily.regular,
                          fontSize: theme.typography.size.small,
                          color: theme.colors.foreground,
                        }}
                      >
                        {currency.symbol} {currency.name} ({currency.code})
                      </Text>
                      <Text
                        selectable
                        style={{
                          fontFamily: theme.typography.fontFamily.semibold,
                          fontSize: theme.typography.size.small,
                          color: isSelected
                            ? theme.colors.foreground
                            : theme.colors.muted,
                        }}
                      >
                        {isSelected ? "Selected" : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <View style={{ gap: 6 }}>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.muted,
                }}
              >
                Preview:
              </Text>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.body,
                  color: theme.colors.foreground,
                }}
              >
                {getCurrencyPreview(selectedCurrency)}
              </Text>
            </View>

            {currencySaveError ? (
              <View style={{ gap: 8 }}>
                <Text
                  selectable
                  style={{
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.size.small,
                    color: "#B42318",
                  }}
                >
                  {currencySaveError}
                </Text>
                <Pressable onPress={() => void handleSaveCurrency()}>
                  <Text
                    selectable
                    style={{
                      fontFamily: theme.typography.fontFamily.medium,
                      fontSize: theme.typography.size.small,
                      color: theme.colors.foreground,
                    }}
                  >
                    Retry Save
                  </Text>
                </Pressable>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => void handleSaveCurrency()}
              disabled={!canSaveCurrency}
              style={({ pressed }) => ({
                borderRadius: theme.radii.md,
                backgroundColor: canSaveCurrency
                  ? theme.colors.accent
                  : theme.colors.muted,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.semibold,
                  fontSize: theme.typography.size.body,
                  color: theme.colors.surface,
                }}
              >
                {isSavingCurrency ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>
          </>
        )}
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 12,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Email Notifications
        </Text>
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.size.small,
            color: theme.colors.muted,
          }}
        >
          Choose which email notifications you want to receive.
        </Text>

        {isEmailLoading ? (
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.size.small,
              color: theme.colors.muted,
            }}
          >
            Loading email preferences...
          </Text>
        ) : emailError ? (
          <View style={{ gap: 8 }}>
            <Text
              selectable
              style={{
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.size.small,
                color: "#B42318",
              }}
            >
              {emailError}
            </Text>
            <Pressable onPress={() => void loadEmail()}>
              <Text
                selectable
                style={{
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.size.small,
                  color: theme.colors.foreground,
                }}
              >
                Retry
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {EMAIL_ROWS.map((row) => (
              <View key={row.key} style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text
                      selectable
                      style={{
                        fontFamily: theme.typography.fontFamily.medium,
                        fontSize: theme.typography.size.small,
                        color: theme.colors.foreground,
                      }}
                    >
                      {row.title}
                    </Text>
                    <Text
                      selectable
                      style={{
                        fontFamily: theme.typography.fontFamily.regular,
                        fontSize: theme.typography.size.small,
                        color: theme.colors.muted,
                      }}
                    >
                      {row.description}
                    </Text>
                  </View>
                  <Switch
                    accessibilityLabel={row.title}
                    value={emailPreferences[row.key]}
                    disabled={Boolean(updatingEmailFields[row.key])}
                    onValueChange={(nextValue) => {
                      void handleEmailToggle(row.key, nextValue);
                    }}
                  />
                </View>
                {emailFieldErrors[row.key] ? (
                  <Text
                    selectable
                    style={{
                      fontFamily: theme.typography.fontFamily.regular,
                      fontSize: theme.typography.size.small,
                      color: "#B42318",
                    }}
                  >
                    {emailFieldErrors[row.key]}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>

      <View
        style={{
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 16,
          gap: 10,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.size.body,
            color: theme.colors.foreground,
          }}
        >
          Account
        </Text>
        <Pressable onPress={handleSignOut} disabled={isSigningOut}>
          <Text
            selectable
            style={{
              fontFamily: theme.typography.fontFamily.medium,
              fontSize: theme.typography.size.small,
              color: isSigningOut ? theme.colors.muted : "#B42318",
            }}
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
