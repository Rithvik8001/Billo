import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(100, "Group name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  emoji: z
    .string()
    .max(10, "Emoji must be less than 10 characters")
    .optional()
    .default("👥"),
});

export const updateGroupSchema = createGroupSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided"
  );

export const addMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"], {
    message: "Role must be either 'admin' or 'member'",
  }),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
