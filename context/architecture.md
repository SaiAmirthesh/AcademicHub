# Architecture

## Stack
Frontend: React + TypeScript + Vite
Backend: Express + TypeScript
Database: PostgreSQL
ORM: Drizzle
Auth: JWT

## Boundaries
Frontend -> API -> Service -> Repository -> Database

## Invariants
- No direct DB access from frontend
- All mutations require authorization
- Validation via Zod
