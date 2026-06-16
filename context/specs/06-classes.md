# Class Orchestration & Joining Codes Specification

Goal: Enable class creation by Admins, scheduling, teacher assignments, and self-enrollment by Students using unique joining codes.

## 1. Database Schema (`src/db/schema/app.ts`)
```typescript
import { pgTable, varchar, integer, timestamp, unique, pgEnum } from "drizzle-orm/pg-core";
import { subjects } from "./app.js";
import { user } from "./auth.js";

export const classStatusEnum = pgEnum("class_status", ["active", "inactive", "archived"]);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
};

// Main Class Table
export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "restrict" }),
  teacherId: text("teacher_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "Section A", "Spring 2026 Batch"
  joinCode: varchar("join_code", { length: 8 }).notNull().unique(), // Auto-generated code
  capacity: integer("capacity").notNull().default(30),
  schedule: varchar("schedule", { length: 255 }), // e.g., "Mon 10:00 - 12:00, Room 302"
  status: classStatusEnum("status").notNull().default("active"),
  ...timestamps
});

// Enrollment mapping Student -> Class
export const enrollments = pgTable("enrollments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  ...timestamps
}, (t) => [
  // Ensure a student cannot enroll in the same class twice
  unique("unique_class_student").on(t.classId, t.studentId)
]);
```

## 2. Join Code Generation & Enrollment Logic
- **Code Generation**: Upon saving a class (`POST /api/classes`), the backend generates a random, cryptographically secure 6-to-8 character uppercase alphanumeric string (e.g. `X8K2PA`).
- **Endpoint `POST /api/classes/join`**:
  - Request body: `{ joinCode: string }`
  - Validates if the user is authenticated with role = `"student"`.
  - Finds class where `joinCode` matches exactly and `status = "active"`.
  - Queries enrollment count. If `currentCount >= class.capacity`, rejects with `400 "Class is full"`.
  - Inserts record into `enrollments` table. If unique constraint fails, returns `400 "Already enrolled"`.

## 3. API Endpoints (`/api/classes`)
REST endpoints serving the Refine frontend:

- **`GET /api/classes`**: Paginated class lists. Supports filters for `subjectId`, `teacherId`, `status`. Admins/Teachers see all classes; Students only see classes they are enrolled in.
- **`GET /api/classes/:id`**: Returns class info, teacher details, and the roster of enrolled students.
- **`POST /api/classes`**: Admin only. Generates the join code and creates the class.
- **`PUT /api/classes/:id`**: Admin or assigned Teacher only. Modifies schedules, capacity, or status.
- **`DELETE /api/classes/:id`**: Admin only. Removes the class section and enrollments.

## 4. Frontend Refine UI
- **Class Grid/List (`src/pages/classes/list.tsx`)**: 
  - Admins & Teachers see a card deck showing Class Name, Subject, Teacher, Enrollment capacity (e.g. `14 / 30`), Status, and the Join Code (`X8K2PA`) with a copy button.
  - Students see a simple grid of their active enrolled classes (hiding joining codes).
- **Join Card (`src/pages/dashboard/student.tsx`)**: Form field for Students to paste a join code and trigger enrollment, refreshing their dashboard list upon success.
