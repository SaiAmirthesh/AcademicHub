import { Request, Response } from 'express';
import { CreateDepartmentInput } from '../validators/departmentSchema'; 
import { departmentService } from '../services/departmentServices';


export class DepartmentController {
    async createDepartment (req:Request,res:Response){
        try{
            const {name,code,description} = req.body;
            const department = await departmentService.createDepartment({name,code,description} as CreateDepartmentInput);
            return res.status(201).json({message: "Department created successfully", department});
        }
        catch(error){
            return res.status(400).json({message: "Failed to create department", error});
        }
    }

    async getDepartments (req:Request,res:Response){
        try{
            const {page,limit,search,sortBy,sortOrder} = req.query;
            const parsedPage = page ? parseInt(page as string, 10) : 1;
            const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

            const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
            const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

            const department = await departmentService.getDepartment({
                page: finalPage,
                limit: finalLimit,
                search: search as string,
                sortBy: sortBy as "name" | "code" | "createdAt",
                sortOrder: sortOrder as "asc" | "desc"
            });
            return res.status(200).json({message: "Department fetched successfully", department});
        }
        catch(error){
            return res.status(400).json({message: "Failed to get department", error});
        }
    }

    async getDepartmentById (req:Request,res:Response){
        try{
            const {id} = req.params;
            const department = await departmentService.getDepartmentById(Number(id));
            return res.status(200).json({message: "Department fetched successfully", department});
        }
        catch(error){
            return res.status(400).json({message: "Failed to get department", error});
        }
    }

    async updateDepartment (req:Request,res:Response){
        try{
            const {id} = req.params;
            const {name,code,description} = req.body;
            const department = await departmentService.updateDepartment(Number(id),{name,code,description} as CreateDepartmentInput);
            return res.status(200).json({message: "Department updated successfully", department});
        }
        catch(error){
            return res.status(400).json({message: "Failed to update department", error});
        }
    }

    async deleteDepartment (req:Request,res:Response){
        try{
            const {id} = req.params;
            const department = await departmentService.deleteDepartment(Number(id));
            if(!department){
                return res.status(404).json({message: "Department not found"});
            }
            return res.status(200).json({message: "Department deleted successfully"});
        }
        catch(error){
            return res.status(400).json({message: "Failed to delete department", error});
        }
    }
}

export const departmentController = new DepartmentController()