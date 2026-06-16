import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsServices.js';

export class AnalyticsController {
  async getAdminAnalytics(req: Request, res: Response) {
    try {
      const data = await analyticsService.getAdminAnalytics();
      return res.status(200).json({
        success: true,
        data,
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

  async getTeacherAnalytics(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Unauthorized: Session required"
        });
      }

      const data = await analyticsService.getTeacherAnalytics(teacherId);
      return res.status(200).json({
        success: true,
        data,
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

  async getStudentAnalytics(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      if (!studentId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: "Unauthorized: Session required"
        });
      }

      const data = await analyticsService.getStudentAnalytics(studentId);
      return res.status(200).json({
        success: true,
        data,
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

export const analyticsController = new AnalyticsController();
