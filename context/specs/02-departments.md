# Departments
CRUD for departments.

## Departments Service

```typescript
interface CreateDepartmentPayload {
  name: string;
  code: string;
  headFacultyId?: string;
}

interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  headFacultyId?: string;
  isArchived?: boolean;
}

// Core CRUD + Helper Methods
async function createDepartment(payload: CreateDepartmentPayload): Promise<Department>;
async function getDepartmentById(id: string): Promise<Department | null>;
async function getAllDepartments(params: ListParams): Promise<PaginatedResponse<Department>>;
async function updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<Department>;
async function softDeleteDepartment(id: string): Promise<void>;
async function findByCode(code: string): Promise<Department | null>;
async function listDepartmentsWithPagination(params: ListParams): Promise<PaginatedResponse<Department>>;

// Security (Role-Based Access Control)
// Rules:
// - Admin can do everything
// - Faculty/Student cannot create/update/delete
// - Faculty can view only their own department
// - Student can view only their own department
async function authorizeCreate(userId: string, role: Role): Promise<void>;
async function authorizeRead(userId: string, role: Role, resourceId?: string): Promise<void>;
async function authorizeUpdate(userId: string, role: Role, resourceId: string): Promise<void>;
async function authorizeDelete(userId: string, role: Role, resourceId: string): Promise<void>;

// Business Logic
// Ensures data integrity and business rules
async function validateDepartmentUniqueness(id: string | null, code: string): Promise<boolean>;
async function checkHeadFacultyAssignment(facultyId: string | null): Promise<void>;
async function validateUpdatePayload(payload: UpdateDepartmentPayload): Promise<void>;

// Convenience Methods
async function getDepartmentWithFaculty(id: string): Promise<Department withFaculty | null>;
async function countDepartments(): Promise<number>;
async function exportDepartmentsToCsv(filters?: DepartmentFilters): Promise<string>;
```
