import { z } from "zod";

export const manualItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z
    .string()
    .regex(/^\d+(\.\d+)?$/, "Invalid quantity")
    .default("1"),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid total"),
});

export const createManualReceiptSchema = z.object({
  merchantName: z.string().min(1, "Merchant name is required"),
  merchantAddress: z.string().optional(),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  tax: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
  items: z.array(manualItemSchema).min(1, "At least one item required"),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export const updateReceiptSchema = z.object({
  merchantName: z.string().optional(),
  merchantAddress: z.string().optional(),
  purchaseDate: z.string().optional(),
  tax: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional(),
});

export type CreateManualReceiptInput = z.infer<
  typeof createManualReceiptSchema
>;
export type ManualItem = z.infer<typeof manualItemSchema>;
export type UpdateReceiptInput = z.infer<typeof updateReceiptSchema>;
