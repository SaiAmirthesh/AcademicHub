import { Request, Response } from 'express';
import { createDepartmentSchema } from '../validators/departmentSchema';
import { departmentService } from '../services/departmentServices';

export class DepartmentController {
  async createDepartment(req: Request, res: Response) {
    try {
      const validatedData = createDepartmentSchema.parse(req.body);
      const department = await departmentService.createDepartment(validatedData);
      return res.status(201).json({
        success: true,
        data: department,
        error: null
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }

  async getDepartments(req: Request, res: Response) {
    try {
      const { page, limit, search, sortBy, sortOrder } = req.query;
      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

      const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
      const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      const result = await departmentService.getDepartment({
        page: finalPage,
        limit: finalLimit,
        search: search as string,
        sortBy: sortBy as "name" | "code" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc"
      });

      return res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }

  async getDepartmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const department = await departmentService.getDepartmentById(Number(id));
      if (!department) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Department not found"
        });
      }
      return res.status(200).json({
        success: true,
        data: department,
        error: null
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }

  async updateDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = createDepartmentSchema.partial().parse(req.body);
      const department = await departmentService.updateDepartment(Number(id), validatedData);
      return res.status(200).json({
        success: true,
        data: department,
        error: null
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }

  async deleteDepartment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const department = await departmentService.deleteDepartment(Number(id));
      if (!department) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Department not found"
        });
      }
      return res.status(200).json({
        success: true,
        data: null,
        error: null
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }
}

export const departmentController = new DepartmentController();