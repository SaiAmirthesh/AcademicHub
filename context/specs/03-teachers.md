# Teacher Directory Specification

Goal: Maintain a directory of teachers, manage their department assignments, and showcase their workload schedules.

## 1. Teacher Profile Fields
A teacher is represented as a user in the `user` table with `role: "teacher"`. They have additional relations:
- `departmentId`: References `departments.id`.
- Associated Subjects: Linked via `subjects` table assignments.
- Associated Classes: Assigned as an instructor in `classes`.

## 2. API Endpoints (`/api/teachers`)
REST routes matching Refine client hooks:

- **`GET /api/teachers`**: Returns a list of all users with `role: "teacher"`. Supports pagination, text search (`q`), and filtering by `departmentId`.
- **`GET /api/teachers/:id`**: Returns specific teacher details, including a list of subjects they teach and their teaching timetable.
- **`POST /api/teachers`**: Creates a new teacher profile. Restricted to **Admin** role.
- **`PUT /api/teachers/:id`**: Updates teacher details. Restricted to **Admin** or the **Teacher** themselves.
- **`DELETE /api/teachers/:id`**: Removes the teacher (and unassigns from their classes). Restricted to **Admin** role.

## 3. Frontend Refine UI
- **List View (`src/pages/teachers/list.tsx`)**: Table displaying Full Name, Email, Department, and Assigned Classes.
- **Create Form**: Form component to submit Name, Email, and Department to the backend.
- **Show View (`src/pages/teachers/show.tsx`)**: Renders teacher profile, department information, and a weekly timetable displaying all their teaching slots.
