import { Router } from 'express';
import { subjectController} from '../controllers/subjectController';

const router = Router()

router.post('/',subjectController.createSubject)
router.get('/',subjectController.getSubject)
router.put('/:id',subjectController.updateSubject)
router.delete('/:id',subjectController.deleteSubject)

export default router;