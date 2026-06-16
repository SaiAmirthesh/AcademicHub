import { Router } from 'express';
import { classController } from '../controllers/classController.js';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Student enrollment endpoint (must be defined before /:id param route)
router.post('/join', requireRole(['student']), classController.joinClass);

// Class CRUD endpoints
router.post('/', requireRole(['admin']), classController.createClass);
router.get('/', requireAuth, classController.getClasses);
router.get('/:id', requireAuth, classController.getClassById);
router.put('/:id', requireRole(['admin', 'teacher']), classController.updateClass);
router.delete('/:id', requireRole(['admin']), classController.deleteClass);

export default router;
