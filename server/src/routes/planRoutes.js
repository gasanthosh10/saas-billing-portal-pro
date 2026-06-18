import { Router } from 'express';
import { createPlan, getPlans } from '../controllers/planController.js';
import { allowRoles, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { planSchema } from '../validators/billingSchemas.js';

const router = Router();

router.use(protect);
router.get('/', getPlans);
router.post('/', allowRoles('Admin'), validate(planSchema), createPlan);

export default router;

