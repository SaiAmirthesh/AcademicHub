import { asc,desc,eq,ilike,or,count } from 'drizzle-orm'
import { db } from '../db'
import { subjects } from '../db/schema/app';
import { CreateSubjectInput } from '../validators/subjectSchema';

type GetSubjectOptions = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
};


export class SubjectService {

    async createSubject(data: CreateSubjectInput){
        const existingSubject = await db.query.subjects.findFirst({ where : eq(subjects.code,data.code)})
        if (existingSubject){
            throw new Error("Subject already exists");
        }

        const[subject] = await db.insert(subjects).values(data).returning();
        return subject;
    }

    async getSubject(options: GetSubjectOptions){
        const {page = 1,limit = 10,search,sortBy = "createdAt",sortOrder = "desc"} = options;
        const offset = (page-1)*limit;

        const whereClause = search ? or(ilike(subjects.name,`%${search}%`),ilike(subjects.code,`%${search}%`)) : undefined;
        const sortColumn = sortBy === "createdAt" ? subjects.createdAt : sortBy === "name" ? subjects.name : subjects.code;
        
        
        const data = await db.query.subjects.findMany({
            where: whereClause,
            limit,
            offset,
            orderBy: [
            sortOrder === "desc"
                ? desc(sortColumn)
                : asc(sortColumn),
            ],
        });
        
        const totalResult =await db
                        .select({
                             count: count(),
                            })
                        .from(subjects)
                        .where(whereClause);

        const total =  Number(totalResult[0]?.count ?? 0);
        return {data,pagination: {page,limit,total,totalPages: Math.ceil(total / limit)}};
    }

    async updateSubject(id: number,data: { department_id?: number | undefined; name?: string | undefined; code?: string | undefined; description?: string | undefined }){
        const existingSubject = await db.query.subjects.findFirst({where: eq(subjects.id,id)})
        if (!existingSubject){
            throw new Error("Subject not found");
        }
        const[subject] = await db.update(subjects).set(data).where(eq(subjects.id,id)).returning();
        return subject;
    }

    async deleteSubject(id:number){
        const existingSubject = await db.query.subjects.findFirst({where: eq(subjects.id,id)})
        if (!existingSubject){
            throw new Error("Subject not found");
        }
        const[subject] = await db.delete(subjects).where(eq(subjects.id,id)).returning();
        return subject;
    }
}
export const subjectService = new SubjectService()