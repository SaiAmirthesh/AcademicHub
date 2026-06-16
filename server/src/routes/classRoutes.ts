import { Router } from 'express';
import { classController } from '../controllers/classController.js';

const router = Router();

// Student enrollment endpoint (must be defined before /:id param route)
router.post('/join', classController.joinClass);

// Class CRUD endpoints
router.post('/', classController.createClass);
router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);

export default router;
