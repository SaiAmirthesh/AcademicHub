import { Response,Request } from "express";
import { subjectService } from "../services/subjectServices";
import { CreateSubjectInput } from "../validators/subjectSchema";


export class SubjectController {
    async createSubject (req:Request,res:Response){
        try{
            const {department_id,name,code,description} = req.body;
            const subject = await subjectService.createSubject({department_id,name,code,description} as CreateSubjectInput);
            return res.status(201).json({message: "Subject created successfully", subject});
        }
        catch(error){
            return res.status(400).json({message: "Failed to create subject", error});
        }
    }

    async getSubject (req:Request,res:Response){
        try{
            const {page,limit,search,sortBy,sortOrder} = req.query;
            const parsedPage = page ? parseInt(page as string, 10) : 1;
            const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

            const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
            const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

            const subject = await subjectService.getSubject({
                page: finalPage,
                limit: finalLimit,
                search: search as string,
                sortBy: sortBy as "name" | "code" | "createdAt",
                sortOrder: sortOrder as "asc" | "desc"
            });
            return res.status(200).json({message: "Subject fetched successfully", subject});
        }
        catch(error){
            return res.status(400).json({message: "Failed to get subject", error});
        }
    }

    async updateSubject (req:Request,res:Response){
        try{
            const {id} = req.params;
            const {department_id,name,code,description} = req.body;
            const subject = await subjectService.updateSubject(Number(id),{department_id,name,code,description} as CreateSubjectInput);
            return res.status(200).json({message: "Subject updated successfully", subject});
        }
        catch(error){
            return res.status(400).json({message: "Failed to update subject", error});
        }
    }

    async deleteSubject (req:Request,res:Response){
        try{
            const {id} = req.params;
            const subject = await subjectService.deleteSubject(Number(id));
            if(!subject){
                return res.status(404).json({message: "Subject not found"});
            }
            return res.status(200).json({message: "Subject deleted successfully"});
        }
        catch(error){
            return res.status(400).json({message: "Failed to delete subject", error});
        }
    }
}
export const subjectController = new SubjectController()
