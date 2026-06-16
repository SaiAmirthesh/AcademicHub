import { relations } from "drizzle-orm";
import {timestamp,pgTable, integer, varchar} from "drizzle-orm/pg-core";

const timestamps = {
    createdAt : timestamp('created_at').defaultNow().notNull(),
    updatedAt : timestamp('updated_at').defaultNow().$onUpdate(()=> new Date()).notNull()
}


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


export const departmentRelations = relations(departments,({many})=>({ subjects : many(subjects)}))
export const subjectsRelations = relations(subjects,({one})=>({
     department : one(departments,
        {
            fields:[subjects.department_id],
            references:[departments.id],
        }
    ),
}))


