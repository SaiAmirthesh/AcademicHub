# Code Standards

## General
- **TypeScript Strict Mode**: Enforce complete type-safety across frontend and backend.
- **Zod Validation**: Define Zod schemas for all request bodies, query params, and environment variables. Use them for client-side forms and backend routing validation.
- **ESLint & Prettier**: Follow consistent formatting and code styling rules.

## Frontend (React + Vite + Refine)
- **Refine Resource Pattern**: Separate pages into sub-folders matching resource names (e.g., `src/pages/departments/list.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`).
- **Headless Component Logic**: Keep Refine hooks (`useTable`, `useForm`) separate from UI styling; style views using shadcn/ui components.
- **Data Providers**: Centralize API communication inside Refine's REST data provider.

## Backend (Express + Drizzle + Better-Auth)
- **Layered Architecture**: Express Router -> Controller (request handling) -> Service (business logic) -> Drizzle ORM (database).
- **Database Schemas**: Separate Drizzle definitions:
  - `src/db/schema/auth.ts`: Better-Auth core schemas.
  - `src/db/schema/app.ts`: University domain schemas (departments, subjects, classes, etc.).
- **Security Middleware**: 
  - Apply Better-Auth session validation for all protected paths.
  - Inject Arcjet middleware at critical entry points (signup, rate-limited CRUD endpoints).
- **Error Handling & Response Contract**: Centralize error handling with Express error middleware and return uniform API responses:
  ```json
  { "success": boolean, "data": any, "error": string }
  ```
