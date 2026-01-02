import { z } from "zod";

export const createSettlementSchema = z.object({
  receiptId: z.number().int().positive().optional(),
  groupId: z.number().int().positive().optional(),
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  amount: z.string().regex(/^\d+\.\d{2}$/, "Amount must have 2 decimal places"),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
});

export const updateSettlementSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export const settlementFiltersSchema = z.object({
  groupId: z
    .union([z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (!val || val === "null" || val === "") return undefined;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }),
  status: z
    .union([z.enum(["pending", "completed", "cancelled"]), z.null()])
    .optional()
    .transform((val) => (val && val !== "null" ? val : undefined)),
  direction: z
    .union([z.enum(["owed", "owing"]), z.null()])
    .optional()
    .transform((val) => (val && val !== "null" ? val : undefined)),
});

