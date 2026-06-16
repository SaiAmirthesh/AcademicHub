import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: 'admin' | 'teacher' | 'student';
                departmentId?: number | null;
                createdAt: Date;
                updatedAt: Date;
            };
        }
    }
}
