import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/admin', requireRole(['admin']), analyticsController.getAdminAnalytics);
router.get('/teacher', requireRole(['teacher']), analyticsController.getTeacherAnalytics);
router.get('/student', requireRole(['student']), analyticsController.getStudentAnalytics);

export default router;
