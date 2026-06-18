import { Router } from 'express';
import { getSubscriptions, updateSubscription } from '../controllers/subscriptionController.js';
import { allowRoles, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { subscriptionUpdateSchema } from '../validators/billingSchemas.js';

const router = Router();

router.use(protect);
router.get('/', getSubscriptions);
router.patch('/:id', allowRoles('Admin', 'Finance'), validate(subscriptionUpdateSchema), updateSubscription);

export default router;

