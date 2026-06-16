import { eq, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { user } from '../db/schema/auth.js';
import { classes, enrollments, departments, subjects } from '../db/schema/app.js';

export class AnalyticsService {
  async getAdminAnalytics() {
    const [deptCount, subjCount, teacherCount, studentCount, classCount] = await Promise.all([
      db.select({ count: count() }).from(departments),
      db.select({ count: count() }).from(subjects),
      db.select({ count: count() }).from(user).where(eq(user.role, "teacher")),
      db.select({ count: count() }).from(user).where(eq(user.role, "student")),
      db.select({ count: count() }).from(classes).where(eq(classes.status, "active")),
    ]);

    const departmentEnrollment = await db
      .select({
        name: departments.name,
        students: count(user.id),
      })
      .from(departments)
      .leftJoin(user, and(eq(user.departmentId, departments.id), eq(user.role, "student")))
      .groupBy(departments.id, departments.name);

    const teacherWorkload = await db
      .select({
        name: user.name,
        classesCount: count(classes.id),
      })
      .from(user)
      .leftJoin(classes, eq(classes.teacherId, user.id))
      .where(eq(user.role, "teacher"))
      .groupBy(user.id, user.name);

    return {
      counts: {
        departments: Number(deptCount[0]?.count ?? 0),
        subjects: Number(subjCount[0]?.count ?? 0),
        teachers: Number(teacherCount[0]?.count ?? 0),
        students: Number(studentCount[0]?.count ?? 0),
        activeClasses: Number(classCount[0]?.count ?? 0),
      },
      departmentEnrollment,
      teacherWorkload,
    };
  }

  async getTeacherAnalytics(teacherId: string) {
    const classCountResult = await db
      .select({ count: count() })
      .from(classes)
      .where(eq(classes.teacherId, teacherId));
    
    const classesTaught = Number(classCountResult[0]?.count ?? 0);

    const distinctStudents = await db
      .selectDistinct({ studentId: enrollments.studentId })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .where(eq(classes.teacherId, teacherId));
    
    const uniqueStudents = distinctStudents.length;

    const classRosterDetails = await db
      .select({
        className: classes.name,
        enrolled: count(enrollments.id),
        capacity: classes.capacity,
      })
      .from(classes)
      .leftJoin(enrollments, eq(enrollments.classId, classes.id))
      .where(eq(classes.teacherId, teacherId))
      .groupBy(classes.id, classes.name, classes.capacity);

    const timetable = await db
      .select({
        classId: classes.id,
        className: classes.name,
        schedule: classes.schedule,
        subjectName: subjects.name,
        status: classes.status,
      })
      .from(classes)
      .innerJoin(subjects, eq(classes.subjectId, subjects.id))
      .where(and(eq(classes.teacherId, teacherId), eq(classes.status, "active")));

    return {
      counts: {
        classesTaught,
        uniqueStudents,
      },
      classRosterDetails,
      timetable,
    };
  }

  async getStudentAnalytics(studentId: string) {
    const joinedCountResult = await db
      .select({ count: count() })
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
    
    const classesJoined = Number(joinedCountResult[0]?.count ?? 0);

    const timetable = await db
      .select({
        classId: classes.id,
        className: classes.name,
        schedule: classes.schedule,
        subjectName: subjects.name,
        teacherName: user.name,
      })
      .from(enrollments)
      .innerJoin(classes, eq(enrollments.classId, classes.id))
      .innerJoin(subjects, eq(classes.subjectId, subjects.id))
      .innerJoin(user, eq(classes.teacherId, user.id))
      .where(and(eq(enrollments.studentId, studentId), eq(classes.status, "active")));

    return {
      counts: {
        classesJoined,
      },
      timetable,
    };
  }
}

export const analyticsService = new AnalyticsService();
