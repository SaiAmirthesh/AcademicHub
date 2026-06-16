# Authentication & Security Specification

Goal: Secure, role-based authentication using **Better-Auth** and backend threat protection using **Arcjet**.

## 1. Database Schema (`src/db/schema/auth.ts`)
Drizzle tables required by Better-Auth, extended with university roles and department associations.

```typescript
import { pgTable, text, timestamp, boolean, varchar, integer } from "drizzle-orm/pg-core";
import { departments } from "./app.js";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role", { enum: ["admin", "teacher", "student"] }).notNull().default("student"),
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
```

## 2. Backend Better-Auth & Arcjet Config
The backend Express app initializes Better-Auth and binds it to Express routes. Arcjet is used as request middleware for rate-limiting and sign-up validation.

### Better-Auth Initialization (`src/lib/auth.ts`)
```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema/index.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
      },
      departmentId: {
        type: "number",
      }
    }
  }
});
```

### Arcjet Protection Middleware (`src/middlewares/security.ts`)
```typescript
import arcjet, { detectBot, shield, tokenBucket, signup } from "@arcjet/node";
import { Request, Response, NextFunction } from "express";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }), // block all scrapers/bots
    signup({
      mode: "LIVE",
      email: {
        blockDisposable: true, // block temporary/disposable emails
        blockFreemail: false,  // allow gmail/yahoo
      }
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    })
  ]
});

export async function protectSignup(req: Request, res: Response, next: NextFunction) {
  const decision = await aj.protect(req, { email: req.body.email });
  if (decision.isDenied()) {
    return res.status(403).json({ success: false, error: "Signup request blocked by security rules." });
  }
  next();
}
```

## 3. Frontend Refine Auth Provider (`src/providers/authProvider.ts`)
Map Better-Auth client methods (`authClient`) to Refine’s interface to allow seamless routing.

```typescript
import { AuthProvider } from "@refinedev/core";
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) return { success: false, error: new Error(error.message) };
    return { success: true, redirectTo: "/" };
  },
  logout: async () => {
    await authClient.signOut();
    return { success: true, redirectTo: "/login" };
  },
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true, redirectTo: "/login" };
    }
    return { error };
  },
  check: async () => {
    const { data: session } = await authClient.useSession();
    if (session) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },
  getPermissions: async () => {
    const { data: session } = await authClient.useSession();
    return session?.user?.role ? [session.user.role] : [];
  },
  getIdentity: async () => {
    const { data: session } = await authClient.useSession();
    if (!session) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      avatar: session.user.image,
      email: session.user.email,
    };
  },
};
```
