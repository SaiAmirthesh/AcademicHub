import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db"; // your drizzle instance
import * as schema from "../db/schema/auth"

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins:[process.env.FRONTEND_URL!],
    advanced: {
        disableOriginCheck: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema 
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        {
            id: "validation-plugin",
            hooks: {
                before: [
                    {
                        matcher: (context) => context.path === "/sign-up/email",
                        handler: async (context) => {
                            const body = context.body as any;
                            if (body) {
                                if (body.role === "admin") {
                                    throw new Error("Admin registration is restricted");
                                }
                                if (!body.departmentId) {
                                    throw new Error("Department is required");
                                }
                            }
                        }
                    }
                ]
            }
        }
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: true,     
            },
            departmentId: {
                type: "number",
                required: false,
                input: true,
            }
        },
    },
});