# Student Directory Specification

Goal: Manage student information, view enrolled classes, and facilitate student self-enrollment via class joining codes.

## 1. Student Profile Fields
A student is represented in the `user` table with `role: "student"`.
- `departmentId`: References `departments.id`.
- Joined Classes: Multi-class association via student-class enrollment table records.

## 2. API Endpoints (`/api/students`)
REST routes matching Refine client hooks:

- **`GET /api/students`**: Returns a list of users with `role: "student"`. Supports pagination, search, and department filtering. Restricted to **Admin** and **Teacher** roles.
- **`GET /api/students/:id`**: Returns specific student profile details and their enrolled classes.
- **`POST /api/students`**: Admin only. Manual student registration.
- **`PUT /api/students/:id`**: Updates student profile details (such as contact details). Restricted to **Admin** or the **Student** themselves.
- **`DELETE /api/students/:id`**: Admin only. Removes the student from the system.

## 3. Student Self-Enrollment Flow
Students register for classes interactively via:
- **`POST /api/classes/join`**: Takes a 6-8 digit alphanumeric `joinCode` payload. Matches code to active class, registers student in class enrollment table, and decrements available class capacity. Restricted to **Student** role.

## 4. Frontend Refine UI
- **Student Directory (`src/pages/students/list.tsx`)**: Table displaying Name, Email, Department, and Enrolled Classes count. Visible to Admins and Teachers.
- **Student Dashboard (`src/pages/dashboard/student.tsx`)**: 
  - Personal profile summary.
  - Interactive "Join Class" component: Input field for join code with submit trigger.
  - Enrolled classes grid displaying class cards (class name, subject, teacher name).
