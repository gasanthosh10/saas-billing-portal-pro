import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { allowRoles, protect } from '../middleware/auth.js';

const router = Router();

router.use(protect, allowRoles('Admin', 'Finance'));
router.get('/', getAuditLogs);

export default router;

