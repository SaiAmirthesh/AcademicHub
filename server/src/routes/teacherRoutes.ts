import { Router } from 'express';
import { teacherController } from '../controllers/teacherController.js';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireRole(['admin']), teacherController.createTeacher);
router.get('/', requireAuth, teacherController.getTeachers);
router.get('/:id', requireAuth, teacherController.getTeacherById);
router.put('/:id', requireAuth, teacherController.updateTeacher);
router.delete('/:id', requireRole(['admin']), teacherController.deleteTeacher);

export default router;
