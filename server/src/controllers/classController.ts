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

      const classesData = await classService.getClasses({
        page: finalPage,
        limit: finalLimit,
        search: search as string,
        sortBy: sortBy as "name" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
        subjectId: subjectId ? Number(subjectId) : undefined,
        teacherId: teacherId as string,
        studentId: studentId as string,
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
      const classRecord = await classService.updateClass(Number(id), validatedData);
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
      const studentId = req.body.studentId || req.headers['x-student-id'] || req.headers['x-user-id'];
      
      if (!studentId) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Student ID (studentId in body or x-student-id in headers) is required to join a class."
        });
      }

      const result = await classService.joinClass(studentId as string, joinCode);
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
