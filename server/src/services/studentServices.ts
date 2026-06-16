import { asc, desc, eq, ilike, or, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { user } from '../db/schema/auth.js';
import { departments, enrollments } from '../db/schema/app.js';
import { auth } from '../lib/auth.js';
import { CreateStudentInput, UpdateStudentInput } from '../validators/studentSchema.js';

type GetStudentsOptions = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  departmentId?: number | undefined;
};

export class StudentService {
  async createStudent(data: CreateStudentInput) {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, data.email.toLowerCase())
    });
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    if (data.departmentId) {
      const dept = await db.query.departments.findFirst({
        where: eq(departments.id, data.departmentId)
      });
      if (!dept) {
        throw new Error("Department not found");
      }
    }

    // Call Better-Auth API to create the user programmatically
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        role: "student",
        departmentId: data.departmentId ?? undefined,
      }
    });

    if (!result || !result.user) {
      throw new Error("Failed to register student via auth service");
    }

    return result.user;
  }

  async getStudents(options: GetStudentsOptions) {
    const { page = 1, limit = 10, search, departmentId } = options;
    const offset = (page - 1) * limit;

    const conditions = [eq(user.role, "student")];

    if (departmentId) {
      conditions.push(eq(user.departmentId, departmentId));
    }

    if (search) {
      const searchOr = or(
        ilike(user.name, `%${search}%`),
        ilike(user.email, `%${search}%`)
      );
      if (searchOr) {
        conditions.push(searchOr);
      }
    }

    const whereClause = and(...conditions);

    const data = await db.query.user.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(user.createdAt)],
      with: {
        department: true,
        enrollments: {
          with: {
            class: {
              with: {
                subject: true,
                teacher: true
              }
            }
          }
        }
      }
    });

    const totalResult = await db
      .select({ count: count() })
      .from(user)
      .where(whereClause);

    const total = Number(totalResult[0]?.count ?? 0);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getStudentById(id: string) {
    const student = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "student")),
      with: {
        department: true,
        enrollments: {
          with: {
            class: {
              with: {
                subject: true,
                teacher: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  }

  async updateStudent(id: string, data: UpdateStudentInput) {
    const student = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "student"))
    });
    if (!student) {
      throw new Error("Student not found");
    }

    if (data.departmentId) {
      const dept = await db.query.departments.findFirst({
        where: eq(departments.id, data.departmentId)
      });
      if (!dept) {
        throw new Error("Department not found");
      }
    }

    const [updated] = await db
      .update(user)
      .set(data)
      .where(and(eq(user.id, id), eq(user.role, "student")))
      .returning();

    return updated;
  }

  async deleteStudent(id: string) {
    const student = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "student"))
    });
    if (!student) {
      throw new Error("Student not found");
    }

    // deletion cascades to enrollments natively due to onDelete: "cascade" in schema
    const [deleted] = await db
      .delete(user)
      .where(and(eq(user.id, id), eq(user.role, "student")))
      .returning();

    return deleted;
  }
}

export const studentService = new StudentService();
