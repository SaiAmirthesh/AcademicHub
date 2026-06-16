import { Request, Response } from 'express';
import { classService } from '../services/classServices.js';
import { createClassSchema, updateClassSchema, joinClassSchema } from '../validators/classSchema.js';

export class ClassController {
  async createClass(req: Request, res: Response) {
    try {
      const validatedData = createClassSchema.parse(req.body);
      const classRecord = await classService.createClass(validatedData);
      return res.status(201).json({
        success: true,
        data: classRecord,
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

  async getClasses(req: Request, res: Response) {
    try {
      const { page, limit, search, sortBy, sortOrder, subjectId, teacherId, studentId, status } = req.query;
      
      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;
      
      const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
      const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      // Students can only view classes they are enrolled in
      let filterStudentId = studentId as string;
      if (req.user?.role === 'student') {
        filterStudentId = req.user.id;
      }

      const classesData = await classService.getClasses({
        page: finalPage,
        limit: finalLimit,
        search: search as string,
        sortBy: sortBy as "name" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
        subjectId: subjectId ? Number(subjectId) : undefined,
        teacherId: teacherId as string,
        studentId: filterStudentId,
        status: status as "active" | "inactive" | "archived"
      });

      return res.status(200).json({
        success: true,
        data: classesData,
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

  async getClassById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classRecord = await classService.getClassById(Number(id));

      // Students can only view classes they are enrolled in
      if (req.user?.role === 'student') {
        const isEnrolled = classRecord.enrollments?.some(e => e.studentId === req.user?.id);
        if (!isEnrolled) {
          return res.status(403).json({
            success: false,
            data: null,
            error: "Forbidden: You are not enrolled in this class"
          });
        }
      }

      return res.status(200).json({
        success: true,
        data: classRecord,
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

  async updateClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateClassSchema.parse(req.body);
      const classId = Number(id);

      // Teachers can only update classes they are assigned to
      if (req.user?.role === 'teacher') {
        const classRecord = await classService.getClassById(classId);
        if (classRecord.teacherId !== req.user.id) {
          return res.status(403).json({
            success: false,
            data: null,
            error: "Forbidden: You are not the assigned teacher for this class"
          });
        }
      }

      const classRecord = await classService.updateClass(classId, validatedData);
      return res.status(200).json({
        success: true,
        data: classRecord,
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

  async deleteClass(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classRecord = await classService.deleteClass(Number(id));
      if (!classRecord) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Class not found"
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

  async joinClass(req: Request, res: Response) {
    try {
      const { joinCode } = joinClassSchema.parse(req.body);
      
      // Securely obtain student ID from authenticated session user
      const studentId = req.user?.id;
      if (!studentId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Unauthorized: Session required"
        });
      }

      const result = await classService.joinClass(studentId, joinCode);
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
}

export const classController = new ClassController();
