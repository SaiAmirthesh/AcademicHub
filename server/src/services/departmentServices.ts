import { asc,desc,eq,ilike,or,count } from 'drizzle-orm'
import { db } from '../db'
import { departments } from '../db/schema/app';
import { CreateDepartmentInput } from '../validators/departmentSchema';

type GetDepartmentsOptions = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export class DepartmentService {

    async createDepartment(data: CreateDepartmentInput){
        const existingDepartment = await db.query.departments.findFirst({ where : eq(departments.code,data.code)})
        if (existingDepartment){
            throw new Error("Department already exists");
        }

        const[department] = await db.insert(departments).values(data).returning();
        return department;
    }
    

    async getDepartment(options: GetDepartmentsOptions) {
        const {page = 1,limit = 10,search,sortBy = "createdAt",sortOrder = "desc"} = options;
        const offset = (page-1)*limit;

        const whereClause = search ? or(ilike(departments.name,`%${search}%`),ilike(departments.code,`%${search}%`)) : undefined;
        const sortColumn = sortBy === "createdAt" ? departments.createdAt : sortBy === "name" ? departments.name : departments.code;
        
        
        const data = await db.query.departments.findMany({
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
                        .from(departments)
                        .where(whereClause);

        const total =  Number(totalResult[0]?.count ?? 0);
        return {data,pagination: {page,limit,total,totalPages: Math.ceil(total / limit)}};
    }

    async getDepartmentById(id: number) {

        const department = await db.query.departments.findFirst({where: eq(departments.id,id)})
        if (!department){
            throw new Error("Department not found");
        }
        return department;
    }

    async updateDepartment(id:number,data: { name?: string | undefined; code?: string | undefined; description?: string | undefined }){
        const existingDepartment = await db.query.departments.findFirst({where: eq(departments.id,id)})
        if (!existingDepartment){
            throw new Error("Department not found");
        }
        const[department] = await db.update(departments).set(data).where(eq(departments.id,id)).returning();
        return department;
    }

    async deleteDepartment(id:number){
        const existingDepartment = await db.query.departments.findFirst({where: eq(departments.id,id)})
        if (!existingDepartment){
            throw new Error("Department not found");
        }
        const[department] = await db.delete(departments).where(eq(departments.id,id)).returning();
        return department;
    }
}

export const departmentService = new DepartmentService();
