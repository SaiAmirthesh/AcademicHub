import {z} from 'zod';

export const  createDepartmentSchema = z.object({
    code: z
        .string()
        .min(2)
        .max(50)
        .regex(/^[A-Z0-9_]+$/),
    name: z
        .string()
        .min(3)
        .max(255),
    
    description : z
        .string()
        .min(3)
        .max(1000)
        .optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;