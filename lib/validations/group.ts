import * as z from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  members: z.array(z.string()).optional(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
