import { z } from "zod";

export const updatePreferencesSchema = z.object({
  currencyCode: z.enum([
    "USD",
    "EUR",
    "GBP",
    "INR",
    "CAD",
    "AUD",
    "JPY",
    "CNY",
  ]),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
