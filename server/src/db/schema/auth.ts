import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { departments, classes, enrollments } from "./app.js";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").$type<"admin" | "teacher" | "student">().notNull().default("student"),
  departmentId: integer("department_id").references(() => departments.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  department: one(departments, {
    fields: [user.departmentId],
    references: [departments.id],
  }),
  classes: many(classes),
  enrollments: many(enrollments),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
