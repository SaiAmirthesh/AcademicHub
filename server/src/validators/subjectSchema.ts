import { z } from 'zod';


export const createSubjectSchema = z.object({
    department_id: z
        .number()
        .int()
        .positive(),
    name: z
        .string()
        .min(3)
        .max(255),
    code: z
        .string()
        .min(2)
        .max(50)
        .regex(/^[A-Z0-9_]+$/),
    description : z
        .string()
        .min(3)
        .max(1000)
        .optional(),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;

