import { relations } from "drizzle-orm";
import { timestamp, pgTable, integer, varchar, text, pgEnum, unique } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

const timestamps = {
    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdate(()=> new Date()).notNull()
}

export const classStatusEnum = pgEnum("class_status", ["active", "inactive", "archived"]);

export const departments = pgTable('departments',{
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code : varchar('code' , {length : 50,}).notNull().unique(),
    name: varchar('name' , {length: 255,}).notNull(),
    description: varchar('description' , {length : 1000}),
    ...timestamps
}); 

export const subjects = pgTable('subjects',{
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    department_id : integer('department_id').notNull().references(()=>departments.id,{onDelete: 'restrict'}),
    code : varchar('code' , {length : 50,}).notNull().unique(),
    name: varchar('name' , {length: 255,}).notNull(),
    description: varchar('description' , {length : 1000}),
    ...timestamps
}); 

export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "restrict" }),
  teacherId: text("teacher_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  joinCode: varchar("join_code", { length: 8 }).notNull().unique(),
  capacity: integer("capacity").notNull().default(30),
  schedule: varchar("schedule", { length: 255 }),
  status: classStatusEnum("status").notNull().default("active"),
  ...timestamps
});

export const enrollments = pgTable("enrollments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  classId: integer("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  ...timestamps
}, (t) => [
  unique("unique_class_student").on(t.classId, t.studentId)
]);

export const departmentRelations = relations(departments, ({ many }) => ({
  subjects: many(subjects)
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  department: one(departments, {
    fields: [subjects.department_id],
    references: [departments.id],
  }),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [classes.subjectId],
    references: [subjects.id],
  }),
  teacher: one(user, {
    fields: [classes.teacherId],
    references: [user.id],
  }),
  enrollments: many(enrollments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
  student: one(user, {
    fields: [enrollments.studentId],
    references: [user.id],
  }),
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
