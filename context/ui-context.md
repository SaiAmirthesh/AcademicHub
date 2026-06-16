# UI Context

## Design Philosophy
A modern, responsive university management portal using **Refine** as the headless dashboard framework, combined with **Tailwind CSS** and **shadcn/ui** for the visual representation.

## Color Palette
- **Primary**: Slate / Indigo (sleek, professional look)
- **Secondary**: Neutral / Zinc
- **Accent**: Emerald (Success/Active), Rose (Error/Inactive), Amber (Warning)

## Core Components & Layouts
- **Refine Headless Hooks**: Heavy usage of `@refinedev/core` hooks (e.g., `useTable`, `useForm`, `useShow`, `useList`) for all resource views.
- **Shadcn UI Base**: High-quality, customized shadcn/ui components (Data Tables, Dialogs, Cards, Selects, Forms).
- **Responsive Layout**: Sidebar navigation that dynamically adjusts, displaying specific resources based on the user's authenticated Better-Auth role.
- **Analytics Charts**: Dynamic dashboards using Recharts to present teacher workloads, class enrollment limits, and department analytics.

## Role-Specific Dashboard Views
- **Admin Workspace**: Overview metrics cards, Department CRUD lists, Subject assign forms, Teacher directory, and Class orchestration grids.
- **Teacher Workspace**: Schedule views, subject/class assignments lists, and student roster details.
- **Student Workspace**: Join Code enrollment form, enrolled class list cards, and timetable view.
