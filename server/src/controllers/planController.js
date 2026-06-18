import { AuditLog } from '../models/AuditLog.js';
import { Plan } from '../models/Plan.js';

export const getPlans = async (_req, res, next) => {
  try {
    res.json(await Plan.find().sort({ price: 1 }));
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    await AuditLog.create({ actor: req.user._id, action: 'created plan', resource: plan.name });
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

