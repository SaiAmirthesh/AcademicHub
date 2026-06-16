import { z } from 'zod';

export const createClassSchema = z.object({
  subjectId: z
    .number()
    .int()
    .positive(),
  teacherId: z
    .string()
    .min(1, "Teacher ID is required"),
  name: z
    .string()
    .min(3, "Class name must be at least 3 characters")
    .max(255),
  capacity: z
    .number()
    .int()
    .positive()
    .default(30),
  schedule: z
    .string()
    .min(3)
    .max(255)
    .optional(),
  status: z
    .enum(["active", "inactive", "archived"])
    .default("active")
    .optional()
});

export const updateClassSchema = createClassSchema.partial();

export const joinClassSchema = z.object({
  joinCode: z
    .string()
    .min(6, "Join code must be at least 6 characters")
    .max(8, "Join code must be at most 8 characters")
    .regex(/^[A-Z0-9]+$/, "Join code must contain only uppercase letters and digits")
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type JoinClassInput = z.infer<typeof joinClassSchema>;
