import { Request, Response } from 'express';
import { studentService } from '../services/studentServices.js';
import { createStudentSchema, updateStudentSchema } from '../validators/studentSchema.js';

export class StudentController {
  async createStudent(req: Request, res: Response) {
    try {
      const validatedData = createStudentSchema.parse(req.body);
      const student = await studentService.createStudent(validatedData);
      return res.status(201).json({
        success: true,
        data: student,
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

  async getStudents(req: Request, res: Response) {
    try {
      const { page, limit, search, departmentId } = req.query;

      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

      const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
      const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      const result = await studentService.getStudents({
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

  async getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Restrict to Admin, Teacher, or the Student themselves
      if (req.user?.role !== 'admin' && req.user?.role !== 'teacher' && req.user?.id !== id) {
        return res.status(403).json({
          success: false,
          data: null,
          error: "Forbidden: You are not authorized to view this profile"
        });
      }

      const student = await studentService.getStudentById(id as string);
      return res.status(200).json({
        success: true,
        data: student,
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

  async updateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Restrict to Admin or the Student themselves
      if (req.user?.role !== 'admin' && req.user?.id !== id) {
        return res.status(403).json({
          success: false,
          data: null,
          error: "Forbidden: You are not authorized to update this profile"
        });
      }

      const validatedData = updateStudentSchema.parse(req.body);
      const student = await studentService.updateStudent(id as string, validatedData);
      return res.status(200).json({
        success: true,
        data: student,
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

  async deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await studentService.deleteStudent(id as string);
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

export const studentController = new StudentController();
