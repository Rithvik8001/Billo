import { z } from "zod";

export const createSettlementSchema = z.object({
  receiptId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
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
    .string()
    .uuid()
    .optional(),
  status: z
    .enum(["pending", "completed", "cancelled"])
    .optional(),
  direction: z
    .enum(["owed", "owing"])
    .optional(),
});

