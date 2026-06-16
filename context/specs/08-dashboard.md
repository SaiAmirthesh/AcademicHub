# Unified Analytics Dashboard Specification

Goal: Provide real-time analytics, metrics summary cards, and timetables for students, teachers, and admins on the dashboard.

## 1. API Endpoints (`/api/analytics`)
Endpoints compile and return database summaries for dashboard visual widgets.

- **`GET /api/analytics/admin`**: Returns count summaries and charts data:
  - `counts`: `{ departments: number, subjects: number, teachers: number, students: number, activeClasses: number }`
  - `departmentEnrollment`: Array of `{ name: string, students: number }` for a bar chart.
  - `teacherWorkload`: Array of `{ name: string, classesCount: number }` for a bar chart.
  - Restricted to **Admin** role.

- **`GET /api/analytics/teacher`**: Returns teacher-specific statistics based on session user:
  - `counts`: `{ classesTaught: number, uniqueStudents: number }`
  - `classRosterDetails`: Array of `{ className: string, enrolled: number, capacity: number }`
  - `timetable`: Timetable representation of scheduled slots.
  - Restricted to **Teacher** role.

- **`GET /api/analytics/student`**: Returns student-specific statistics:
  - `counts`: `{ classesJoined: number }`
  - `timetable`: Combined schedule array from all joined classes.
  - Restricted to **Student** role.

## 2. Frontend Dashboard UI
Unified landing page (`src/pages/dashboard/index.tsx`) that dynamically mounts widgets depending on the authenticated role from `authProvider.getPermissions()`.

### A. Admin Dashboard Widgets
- **Metrics Row**: Grid of cards showing total departments, subjects, teachers, and students.
- **Enrollment Bar Chart**: Recharts bar chart showing student concentration across departments.
- **Workload Bar Chart**: Recharts bar chart representing class allocations per teacher.
- **Recent Registrations Table**: List of recently registered teachers or classes.

### B. Teacher Dashboard Widgets
- **Teacher Metrics**: Display cards containing count of active classes taught and total students.
- **Active Roster Lists**: Tables showing class sections, current size, and joining code information.
- **Weekly Schedule Card**: A timetable component highlighting teaching time windows.

### C. Student Dashboard Widgets
- **Student Profile**: Cloudinary avatar picture and details.
- **Timetable Calendar**: Grid display of the current week showing timeslots for all enrolled subjects.
- **Join Class Widget**: Simple card with a text input for pasting join codes.
- **Enrolled Classes Deck**: Layout of active classes with names, subjects, and instructor names.
