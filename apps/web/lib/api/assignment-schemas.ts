import { z } from "zod";

export const assignmentItemSchema = z.object({
  receiptItemId: z.number().int().positive(),
  userId: z.string().min(1),
  splitType: z.enum(["full", "percentage", "amount"]),
  splitValue: z.string().nullable(),
  calculatedAmount: z.string().regex(/^\d+\.\d{2}$/),
});

export const createAssignmentsSchema = z.object({
  assignments: z.array(assignmentItemSchema).min(1),
});

export type CreateAssignmentsInput = z.infer<typeof createAssignmentsSchema>;
export type AssignmentItem = z.infer<typeof assignmentItemSchema>;
