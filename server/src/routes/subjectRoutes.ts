import { Router } from 'express';
import { subjectController} from '../controllers/subjectController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router()

router.post('/', requireRole(['admin']), subjectController.createSubject)
router.get('/', requireAuth, subjectController.getSubject)
router.put('/:id', requireRole(['admin']), subjectController.updateSubject)
router.delete('/:id', requireRole(['admin']), subjectController.deleteSubject)

export default router;