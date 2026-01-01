import { z } from "zod";

export const receiptExtractionSchema = z.object({
  merchantName: z.string().optional(),
  merchantAddress: z.string().optional(),
  purchaseDate: z.string().optional(),
  totalAmount: z.string(),
  tax: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.string(),
      unitPrice: z.string(),
      totalPrice: z.string(),
      lineNumber: z.number().optional(),
      category: z.string().optional(),
    })
  ),
});

export type ReceiptExtractionResult = z.infer<typeof receiptExtractionSchema>;
