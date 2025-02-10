import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().datetime(),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateExpenseSchema = expenseSchema.partial();

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
