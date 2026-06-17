import { z } from 'zod';

export const createStudentSchema = z.object({
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

export const updateStudentSchema = z.object({
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

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
