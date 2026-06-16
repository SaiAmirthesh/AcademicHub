# Department Module Specification

Goal: Admin-managed departments that act as organizational brackets for subjects, teachers, and students.

## 1. Database Schema (`src/db/schema/app.ts`)
```typescript
import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
};

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  ...timestamps
});
```

## 2. API Endpoints (`/api/departments`)
Backend Express routes mapping to Refine's REST data provider requirements.

- **`GET /api/departments`**: Paginated list of departments. Supports sorting and query filters.
- **`GET /api/departments/:id`**: Returns a single department including relations (associated subjects and faculty count).
- **`POST /api/departments`**: Creates a department. Restricted to **Admin** role.
- **`PUT /api/departments/:id`**: Modifies department details. Restricted to **Admin** role.
- **`DELETE /api/departments/:id`**: Removes a department. Restricted to **Admin** role.

## 3. Security (Role-Based Access Control)
- **Admin**: Full Read, Write, Update, Delete access.
- **Teacher / Student**: Read-only access to department lists and their specific assigned department info.

## 4. Frontend Refine UI
- **List View (`src/pages/departments/list.tsx`)**: Table displaying Code, Name, Description, and Creation Date. Utilizes Refine's `useTable` hook and shadcn/ui's `<Table>`.
- **Create / Edit Views**: Modal or slide-over drawer forms using Refine's `useForm` hook, validated client-side with Zod.
- **Show View (`src/pages/departments/show.tsx`)**: Renders department information, showing list of teachers and subjects enrolled in it.
