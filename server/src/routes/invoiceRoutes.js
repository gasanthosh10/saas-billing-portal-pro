import { Router } from 'express';
import { z } from 'zod';
import { createInvoice, getInvoices, payInvoice } from '../controllers/invoiceController.js';
import { allowRoles, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { invoiceSchema } from '../validators/billingSchemas.js';

const router = Router();

router.use(protect);
router.get('/', getInvoices);
router.post('/', allowRoles('Admin', 'Finance'), validate(invoiceSchema), createInvoice);
router.patch('/:id/pay', validate(z.object({ method: z.enum(['Card', 'Bank Transfer', 'UPI', 'Wallet']).optional() })), payInvoice);

export default router;

