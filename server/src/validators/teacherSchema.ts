import { z } from 'zod';

export const createTeacherSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(255),
    email: z
        .string()
        .email(),
    password: z
        .string()
        .min(8),
    departmentId: z
        .number()
        .int()
        .positive(),
});

export const updateTeacherSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(255)
        .optional(),
    departmentId: z
        .number()
        .int()
        .positive()
        .optional()
        .nullable(),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
