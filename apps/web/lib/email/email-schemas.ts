import { z } from "zod";

export const emailPreferencesSchema = z.object({
  emailGroupInvites: z.boolean().optional(),
  emailSettlements: z.boolean().optional(),
  emailPayments: z.boolean().optional(),
  emailWeeklySummary: z.boolean().optional(),
});

export type EmailPreferencesInput = z.infer<typeof emailPreferencesSchema>;
