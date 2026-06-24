# AcademicHub

A modern, decoupled university management dashboard built with a PERN stack. AcademicHub provides secure role-based access for admins, teachers, and students to manage academic operations in one unified platform.

## Features

- **Multi-Role Authentication**: Secure role-based routing with Better-Auth and Arcjet
- **Departmental Governance**: Organize subjects and faculties into structured academic branches
- **Class Orchestration**: Code-based enrollment using 6-8 digit join codes with capacity management
- **Faculty Directory**: Dynamic profiles with pagination and schedule tracking
- **Analytics Dashboard**: Real-time enrollment stats and workload insights
- **Runtime Security**: Protection against bots, DDoS, and spam signups via Arcjet

## Tech Stack

**Frontend**
- React + TypeScript + Vite
- Refine (headless admin framework)
- Tailwind CSS + shadcn/ui

**Backend**
- Express + Node.js + TypeScript
- PostgreSQL (Neon Serverless)
- Drizzle ORM
- Better-Auth

## User Roles

- **Admin**: Manage departments, faculty assignments, subjects, and global settings
- **Teacher**: Manage classes, view assignments, and track student workloads
- **Student**: Enroll using join codes and access class materials and timetables

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env files for frontend and backend

# Run development server
npm run dev
```

