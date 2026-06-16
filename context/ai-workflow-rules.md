# AI Workflow Rules

## Purpose

This document defines how AI agents participate in the AcademicHub project.

AI agents are implementation specialists.

Humans are responsible for product direction, architecture decisions, scope definition, and acceptance criteria.

Agents execute documented decisions.

Agents do not invent undocumented decisions.

---

# Core Principles

## 1. Spec-Driven Development

Every implementation task must originate from a documented specification.

Sources of truth:

1. AGENTS.md
2. project-overview.md
3. architecture.md
4. code-standards.md
5. ui-context.md
6. progress-tracker.md
7. context-manager.md
8. specs/*.md

If a requirement is not documented, it does not exist.

---

## 2. One Unit At A Time

Agents must only implement the currently active specification.

Do not:

* Build future modules
* Anticipate future requirements
* Create speculative features

Complete the current unit before moving to the next one.

---

## 3. Never Invent Requirements

If information is missing:

Stop implementation.

Report:

* Missing requirement
* Missing business rule
* Missing UI behavior
* Missing validation rule

Request clarification.

Never guess.

---

## 4. Architecture Is Protected

The following decisions are locked unless explicitly changed by the architect:

### Frontend

* React
* TypeScript
* Vite
* Refine
* Tailwind CSS
* shadcn/ui

### Backend

* Express
* TypeScript

### Security

* Better-Auth
* Arcjet

### Database

* PostgreSQL
* Drizzle ORM

### Storage

* Cloudinary

Agents must not replace architecture decisions.

---

# Frontend Workflow Rules

## Refine First

All resource pages must follow Refine conventions.

Examples:

* List
* Create
* Edit
* Show

Use Refine hooks whenever possible.

Examples:

* useTable
* useForm
* useList
* useShow

Do not bypass Refine patterns without documented approval.

---

## UI Consistency

Follow ui-context.md.

Agents must not:

* Invent color systems
* Invent spacing systems
* Invent component libraries

Use:

* Tailwind CSS
* shadcn/ui

as the visual foundation.

---

## Responsive Requirements

All pages must support:

* Desktop
* Tablet
* Mobile

Responsive behavior is mandatory.

---

# Backend Workflow Rules

## Layered Architecture

Required request flow:

Router
→ Controller
→ Service
→ Drizzle ORM
→ Database

Controllers:

* Validate requests
* Return responses

Services:

* Business logic

Database layer:

* Data access only

Business logic must never live in routes.

---

## Validation Rules

All inputs must be validated using Zod.

Required:

* Request body validation
* Query validation
* Route parameter validation

Never trust client input.

---

## API Response Format

Every endpoint should return:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

or

```json
{
  "success": false,
  "data": null,
  "error": "message"
}
```

Consistent response structures are mandatory.

---

# Authentication Rules

Authentication system:

* Better-Auth

Authorization model:

* Role-Based Access Control

Roles:

* Admin
* Teacher
* Student

Protected resources must verify:

1. Authentication
2. Authorization

before executing business logic.

---

# Security Rules

Arcjet protections must remain active.

Protected routes should include:

* Rate limiting
* Bot detection
* Abuse prevention

Security middleware cannot be removed without approval.

---

# Database Rules

Database technology:

* PostgreSQL

ORM:

* Drizzle ORM

Rules:

* Use schema-first development
* Use migrations
* Maintain foreign key integrity
* Never perform destructive schema changes without documentation

---

# Cloudinary Rules

Cloudinary is the only approved file storage provider.

Use Cloudinary for:

* User avatars
* Faculty profile images
* Class documents

Do not store files directly in PostgreSQL.

---

# Documentation Synchronization

After completing a unit:

Update:

* progress-tracker.md

If ownership changes:

Update:

* context-manager.md

If architecture changes:

Update:

* architecture.md

Documentation must remain synchronized with implementation.

---

# Verification Checklist

Before marking a unit complete:

* Requirements implemented
* Types validated
* Zod validation added
* Authorization verified
* Responsive UI verified
* API responses standardized
* Documentation updated

All checklist items must pass.

---

# Context Recovery Rule

Conversation history is not the source of truth.

Context files are the source of truth.

If context becomes fragmented:

Regenerate:

* AGENTS.md
* project-overview.md
* architecture.md
* code-standards.md
* ui-context.md
* progress-tracker.md
* context-manager.md
* relevant specs

before continuing development.

---

# Completion Rule

A task is complete only when:

1. Implementation works
2. Documentation is updated
3. Verification checklist passes
4. Progress tracker is updated

Code without updated context is considered incomplete.
