import { asc, desc, eq, ilike, or, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { user } from '../db/schema/auth.js';
import { classes, departments } from '../db/schema/app.js';
import { auth } from '../lib/auth.js';
import { CreateTeacherInput, UpdateTeacherInput } from '../validators/teacherSchema.js';

type GetTeachersOptions = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  departmentId?: number | undefined;
};

export class TeacherService {
  async createTeacher(data: CreateTeacherInput) {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, data.email.toLowerCase())
    });
    if (existingUser) {
      throw new Error("Email is already registered");
    }

    if (!data.departmentId) {
      throw new Error("Department is required");
    }

    const dept = await db.query.departments.findFirst({
      where: eq(departments.id, data.departmentId)
    });
    if (!dept) {
      throw new Error("Department not found");
    }

    // Call Better-Auth API to create the user programmatically
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        role: "teacher",
        departmentId: data.departmentId ?? undefined,
      } as any
    });

    if (!result || !result.user) {
      throw new Error("Failed to register teacher via auth service");
    }

    return result.user;
  }

  async getTeachers(options: GetTeachersOptions) {
    const { page = 1, limit = 10, search, departmentId } = options;
    const offset = (page - 1) * limit;

    const conditions = [eq(user.role, "teacher")];

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
        classes: {
          with: {
            subject: true
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

  async getTeacherById(id: string) {
    const teacher = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "teacher")),
      with: {
        department: true,
        classes: {
          with: {
            subject: true
          }
        }
      }
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Extract unique subjects taught across all assigned classes
    const subjectsMap = new Map();
    if (teacher.classes) {
      for (const cls of teacher.classes) {
        if (cls.subject) {
          subjectsMap.set(cls.subject.id, cls.subject);
        }
      }
    }
    const subjectsTaught = Array.from(subjectsMap.values());

    return {
      ...teacher,
      subjects: subjectsTaught
    };
  }

  async updateTeacher(id: string, data: UpdateTeacherInput) {
    const teacher = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "teacher"))
    });
    if (!teacher) {
      throw new Error("Teacher not found");
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
      .where(and(eq(user.id, id), eq(user.role, "teacher")))
      .returning();

    return updated;
  }

  async deleteTeacher(id: string) {
    const teacher = await db.query.user.findFirst({
      where: and(eq(user.id, id), eq(user.role, "teacher"))
    });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Due to 'restrict' foreign keys on class.teacherId, we must delete/reassign classes first
    // Spec: "Removes the teacher (and unassigns from their classes)"
    // Since teacherId is NOT NULL, we delete classes first. Cascades to enrollments.
    await db.delete(classes).where(eq(classes.teacherId, id));

    const [deleted] = await db
      .delete(user)
      .where(and(eq(user.id, id), eq(user.role, "teacher")))
      .returning();

    return deleted;
  }
}

export const teacherService = new TeacherService();
