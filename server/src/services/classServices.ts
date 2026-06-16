import { eq, and, count, desc, asc, or, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { classes, enrollments, subjects } from "../db/schema/app.js";
import { user } from "../db/schema/auth.js";
import { CreateClassInput, UpdateClassInput } from "../validators/classSchema.js";
import crypto from "crypto";

function generateJoinCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    code += chars[randomIndex];
  }
  return code;
}

type GetClassesOptions = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  subjectId?: number | undefined;
  teacherId?: string | undefined;
  studentId?: string | undefined;
  status?: "active" | "inactive" | "archived" | undefined;
};

export class ClassService {
  async createClass(data: CreateClassInput) {
    const subject = await db.query.subjects.findFirst({
      where: eq(subjects.id, data.subjectId)
    });
    if (!subject) {
      throw new Error("Subject not found");
    }

    const teacher = await db.query.user.findFirst({
      where: and(eq(user.id, data.teacherId), eq(user.role, "teacher"))
    });
    if (!teacher) {
      throw new Error("Teacher not found or user is not a teacher");
    }

    let joinCode = "";
    let isUnique = false;
    while (!isUnique) {
      joinCode = generateJoinCode(8);
      const existingClass = await db.query.classes.findFirst({
        where: eq(classes.joinCode, joinCode)
      });
      if (!existingClass) {
        isUnique = true;
      }
    }

    const [newClass] = await db
      .insert(classes)
      .values({
        ...data,
        joinCode
      })
      .returning();

    return newClass;
  }

  async getClasses(options: GetClassesOptions) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      subjectId,
      teacherId,
      studentId,
      status
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];

    if (search) {
      conditions.push(ilike(classes.name, `%${search}%`));
    }
    if (subjectId) {
      conditions.push(eq(classes.subjectId, subjectId));
    }
    if (teacherId) {
      conditions.push(eq(classes.teacherId, teacherId));
    }
    if (status) {
      conditions.push(eq(classes.status, status));
    }

    if (studentId) {
      const enrolledClasses = await db
        .select({ classId: enrollments.classId })
        .from(enrollments)
        .where(eq(enrollments.studentId, studentId));
      
      const classIds = enrolledClasses.map(ec => ec.classId);
      if (classIds.length === 0) {
        return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }
      conditions.push(or(...classIds.map(id => eq(classes.id, id))));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const sortColumn = sortBy === "name" ? classes.name : classes.createdAt;

    const data = await db.query.classes.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [
        sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn)
      ],
      with: {
        subject: true,
        teacher: true
      }
    });

    const totalResult = await db
      .select({ count: count() })
      .from(classes)
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

  async getClassById(id: number) {
    const classRecord = await db.query.classes.findFirst({
      where: eq(classes.id, id),
      with: {
        subject: {
          with: {
            department: true
          }
        },
        teacher: true,
        enrollments: {
          with: {
            student: true
          }
        }
      }
    });

    if (!classRecord) {
      throw new Error("Class not found");
    }

    return classRecord;
  }

  async updateClass(id: number, data: UpdateClassInput) {
    const existingClass = await db.query.classes.findFirst({
      where: eq(classes.id, id)
    });
    if (!existingClass) {
      throw new Error("Class not found");
    }

    if (data.subjectId) {
      const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, data.subjectId)
      });
      if (!subject) {
        throw new Error("Subject not found");
      }
    }

    if (data.teacherId) {
      const teacher = await db.query.user.findFirst({
        where: and(eq(user.id, data.teacherId), eq(user.role, "teacher"))
      });
      if (!teacher) {
        throw new Error("Teacher not found or user is not a teacher");
      }
    }

    const [updatedClass] = await db
      .update(classes)
      .set(data)
      .where(eq(classes.id, id))
      .returning();

    return updatedClass;
  }

  async deleteClass(id: number) {
    const existingClass = await db.query.classes.findFirst({
      where: eq(classes.id, id)
    });
    if (!existingClass) {
      throw new Error("Class not found");
    }

    const [deletedClass] = await db
      .delete(classes)
      .where(eq(classes.id, id))
      .returning();

    return deletedClass;
  }

  async joinClass(studentId: string, joinCode: string) {
    const classRecord = await db.query.classes.findFirst({
      where: and(eq(classes.joinCode, joinCode.toUpperCase()), eq(classes.status, "active"))
    });
    if (!classRecord) {
      throw new Error("Class not found or is currently inactive/archived");
    }

    const enrollmentCountResult = await db
      .select({ count: count() })
      .from(enrollments)
      .where(eq(enrollments.classId, classRecord.id));
    const currentCount = Number(enrollmentCountResult[0]?.count ?? 0);

    if (currentCount >= classRecord.capacity) {
      throw new Error("Class is already full");
    }

    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.classId, classRecord.id),
        eq(enrollments.studentId, studentId)
      )
    });
    if (existingEnrollment) {
      throw new Error("You are already enrolled in this class");
    }

    const [enrollment] = await db
      .insert(enrollments)
      .values({
        classId: classRecord.id,
        studentId
      })
      .returning();

    return { enrollment, class: classRecord };
  }
}

export const classService = new ClassService();
