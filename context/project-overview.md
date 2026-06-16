# Project Overview

Project: AcademicHub (JSM University Dashboard Clone)

## Vision
A decoupled, high-performance PERN-stack University Management Dashboard that serves as an academic hub. The system utilizes a modern, security-first infrastructure featuring a React/Vite/Refine frontend and an Express/Node.js backend, providing role-based dashboard spaces for campus operations.

## Roles
- **Admin**: Oversees departmental governance, faculty assignments, subject creation, and global settings.
- **Teacher**: Manages classes, views assignments, and tracks assigned student workloads.
- **Student**: Enrolls in classes using join codes and views class timetables/materials.

## In Scope
- **Multi-Role Authentication**: Secure role-based routing and protection via Better-Auth & Arcjet.
- **Departmental Governance**: Organization of subjects and faculties into structured academic branches.
- **Intelligent Subject Management**: Centralized curriculum creation and workload association.
- **Dynamic Faculty Directory**: Profiles (Cloudinary uploads), pagination, and schedule tracking for teachers.
- **Advanced Class Orchestration**: Code-based enrollment via 6-8 digit join codes, capacity limits, and teacher assignments.
- **Unified Analytics Dashboard**: Real-time stats on enrollment, classes, and analytics.
- **API Runtime Security**: Protection against bots, DDoS, and spam signups via Arcjet.

## Out Of Scope
- Mobile applications, payment gateways, and learning management system (LMS) content hosting/delivery.

## Success Criteria
- Fully decoupled client and server communication using Refine's REST data provider.
- Secure, rate-limited backend routes verified by Arcjet.
- Multi-role enrollment flow working end-to-end with join codes.
- Complete database migrations and seeding via Drizzle ORM.
