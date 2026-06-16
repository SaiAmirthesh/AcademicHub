# Architecture

## Stack
- **Frontend**: React + TypeScript + Vite + Refine (headless admin framework) + Tailwind CSS + shadcn/ui
- **Backend**: Express + Node.js + TypeScript
- **Security**: Arcjet (rate limiting, bot detection, email verification middleware)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Auth**: Better-Auth
- **Media Storage**: Cloudinary (avatar and class document storage)

## Boundaries
Refine Client (Data/Auth Providers) -> REST API Endpoints -> Express Router -> Middleware (Arcjet / Better-Auth validation) -> Controllers -> Services -> Drizzle ORM Schema -> Neon PostgreSQL Database.

## Invariants
- **No Direct DB Access**: Frontend only interacts with backend API endpoints.
- **Strict Authorization**: Better-Auth sessions gate all data modification endpoints and protected routes.
- **Runtime Threat Mitigation**: Arcjet inspects all incoming requests for bots, spam sign-ups, and rate limits.
- **Type-Safe Validation**: Data contracts must be validated using Zod on both client and server.
- **Role Isolation**: Admins, teachers, and students can only access their respective dashboards and allowed resources.
