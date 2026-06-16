import { Request, Response } from "express";
import { subjectService } from "../services/subjectServices";
import { createSubjectSchema } from "../validators/subjectSchema";

export class SubjectController {
  async createSubject(req: Request, res: Response) {
    try {
      const validatedData = createSubjectSchema.parse(req.body);
      const subject = await subjectService.createSubject(validatedData);
      return res.status(201).json({
        success: true,
        data: subject,
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

  async getSubject(req: Request, res: Response) {
    try {
      const { page, limit, search, sortBy, sortOrder } = req.query;
      const parsedPage = page ? parseInt(page as string, 10) : 1;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 10;

      const finalPage = isNaN(parsedPage) || parsedPage <= 0 ? 1 : parsedPage;
      const finalLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;

      const result = await subjectService.getSubject({
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

  async updateSubject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = createSubjectSchema.partial().parse(req.body);
      const subject = await subjectService.updateSubject(Number(id), validatedData);
      return res.status(200).json({
        success: true,
        data: subject,
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

  async deleteSubject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subject = await subjectService.deleteSubject(Number(id));
      if (!subject) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Subject not found"
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

export const subjectController = new SubjectController();
