import { Router } from "express"
import { departmentController } from "../controllers/departmentController"
import { requireAuth, requireRole } from "../middleware/auth"

const router = Router();

router.post('/', requireRole(['admin']), departmentController.createDepartment);
router.get('/', requireAuth, departmentController.getDepartments);
router.get('/:id', requireAuth, departmentController.getDepartmentById);
router.put('/:id', requireRole(['admin']), departmentController.updateDepartment);
router.delete('/:id', requireRole(['admin']), departmentController.deleteDepartment);

export default router


