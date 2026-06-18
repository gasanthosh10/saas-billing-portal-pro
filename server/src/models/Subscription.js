import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: { type: String, enum: ['Trialing', 'Active', 'Past Due', 'Canceled'], default: 'Trialing' },
    seatsUsed: { type: Number, default: 1 },
    startedAt: { type: Date, default: Date.now },
    renewalDate: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);

