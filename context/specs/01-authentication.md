# Authentication

Goal: Secure JWT authentication.

Verification:
- Login works
- Protected routes work
- Role checks work

## Authentication Service

```typescript
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
}

interface AuthResponse {
  user: UserWithProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface MeResponse {
  user: UserWithProfile;
  permissions: string[];
}

// Core Methods
async function login(payload: LoginPayload): Promise<AuthResponse>;
async function register(payload: RegisterPayload): Promise<AuthResponse>;
async function logout(refreshToken: string): Promise<void>;
async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
}>;
async function getCurrentUser(userId: string): Promise<UserWithProfile | null>;
async function getCurrentUserWithProfile(userId: string): Promise<UserWithProfile | null>;
async function getPermissions(userId: string): Promise<string[]>;

// Security Helpers
async function hashPassword(password: string): Promise<string>;
async function verifyPassword(password: string, hash: string): Promise<boolean>;
async function generateTokens(user: User): Promise<{
  accessToken: string;
  refreshToken: string;
}>;
async function verifyAccessToken(token: string): Promise<{
  sub: string;
  role: UserRole;
} | null>;

// Business Logic
async function validateUniqueUser(email: string, id?: string): Promise<boolean>;
async function validatePasswordComplexity(password: string): Promise<boolean>;
async function checkDepartmentMembership(userId: string, departmentId: string): Promise<boolean>;

// Convenience Methods
async function me(request: Request): Promise<MeResponse>;
```
