import { Router } from 'express';
import { studentController } from '../controllers/studentController.js';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireRole(['admin']), studentController.createStudent);
router.get('/', requireRole(['admin', 'teacher']), studentController.getStudents);
router.get('/:id', requireAuth, studentController.getStudentById);
router.put('/:id', requireAuth, studentController.updateStudent);
router.delete('/:id', requireRole(['admin']), studentController.deleteStudent);

export default router;
