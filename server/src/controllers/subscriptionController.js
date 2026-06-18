import { AuditLog } from '../models/AuditLog.js';
import { Subscription } from '../models/Subscription.js';
import { HttpError } from '../utils/httpError.js';

const populate = (query) => query.populate('company', 'name status billingEmail').populate('plan', 'name price interval seats');

export const getSubscriptions = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Customer' ? { company: req.user.company?._id } : {};
    res.json(await populate(Subscription.find(filter)).sort({ renewalDate: 1 }));
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subscription) throw new HttpError('Subscription not found', 404);

    await AuditLog.create({
      actor: req.user._id,
      action: 'updated subscription',
      resource: subscription._id.toString(),
      metadata: req.body
    });

    res.json(await populate(Subscription.findById(subscription._id)));
  } catch (error) {
    next(error);
  }
};

