# Subject Management Specification

Goal: Maintain curriculum subjects that link to departments, allowing admins to group courses and track teacher assignments.

## 1. Database Schema (`src/db/schema/app.ts`)
```typescript
import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { departments } from "./app.js";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
};

export const subjects = pgTable("subjects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  departmentId: integer("department_id").notNull().references(() => departments.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  ...timestamps
});
```

## 2. API Endpoints (`/api/subjects`)
REST routes supporting Refine client hooks:

- **`GET /api/subjects`**: Returns a list of subjects. Supports search, pagination, and department-based filters.
- **`GET /api/subjects/:id`**: Returns specific subject details, including the department name and a list of teachers assigned to teach this subject.
- **`POST /api/subjects`**: Admin only. Creates a new subject under a specific department.
- **`PUT /api/subjects/:id`**: Admin only. Updates subject name/description.
- **`DELETE /api/subjects/:id`**: Admin only. Deletes a subject. Fails if active classes are still associated with this subject (restricted reference integrity).

## 3. Security (Role-Based Access Control)
- **Admin**: Full read, write, update, delete permissions.
- **Teacher / Student**: Read-only access to view curriculum subjects.

## 4. Frontend Refine UI
- **List Page (`src/pages/subjects/list.tsx`)**: Table layout displaying Subject Name, Description, Department (using Refine's relational data loading or direct join), and creation date. Supports simple select filters for departments.
- **Forms**: Create/Edit inputs (Name, Description, Department Selector dropdown) using Refine's form context.
