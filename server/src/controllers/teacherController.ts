import { Request, Response } from 'express';
import { teacherService } from '../services/teacherServices.js';
import { createTeacherSchema, updateTeacherSchema } from '../validators/teacherSchema.js';

export class TeacherController {
  async createTeacher(req: Request, res: Response) {
    try {
      const validatedData = createTeacherSchema.parse(req.body);
      const teacher = await teacherService.createTeacher(validatedData);
      return res.status(201).json({
        success: true,
        data: teacher,
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

  async getTeachers(req: Request, res: Response) {
    try {
      const { page, limit, search, departmentId } = req.query;

      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

      const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
      const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      const result = await teacherService.getTeachers({
        page: finalPage,
        limit: finalLimit,
        search: search as string,
        departmentId: departmentId ? Number(departmentId) : undefined
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

  async getTeacherById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const teacher = await teacherService.getTeacherById(id as string);
      return res.status(200).json({
        success: true,
        data: teacher,
        error: null
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        data: null,
        error: error.message || error
      });
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Restrict to Admin or the Teacher themselves
      if (req.user?.role !== 'admin' && req.user?.id !== id) {
        return res.status(403).json({
          success: false,
          data: null,
          error: "Forbidden: You are not authorized to update this profile"
        });
      }

      const validatedData = updateTeacherSchema.parse(req.body);
      const teacher = await teacherService.updateTeacher(id as string, validatedData);
      return res.status(200).json({
        success: true,
        data: teacher,
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

  async deleteTeacher(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await teacherService.deleteTeacher(id as string);
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

export const teacherController = new TeacherController();
