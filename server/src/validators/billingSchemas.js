import { z } from 'zod';

export const planSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  description: z.string().optional().default(''),
  price: z.number().min(0),
  interval: z.enum(['Monthly', 'Yearly']).optional(),
  seats: z.number().int().min(1),
  features: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional()
});

export const subscriptionUpdateSchema = z.object({
  status: z.enum(['Trialing', 'Active', 'Past Due', 'Canceled']).optional(),
  plan: z.string().optional(),
  seatsUsed: z.number().int().min(1).optional(),
  renewalDate: z.string().optional(),
  cancelAtPeriodEnd: z.boolean().optional()
});

export const invoiceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  subscription: z.string().min(1, 'Subscription is required'),
  amount: z.number().min(0),
  tax: z.number().min(0).optional().default(0),
  dueDate: z.string().min(1, 'Due date is required')
});

