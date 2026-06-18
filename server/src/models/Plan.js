import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    interval: { type: String, enum: ['Monthly', 'Yearly'], default: 'Monthly' },
    seats: { type: Number, required: true, min: 1 },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Plan = mongoose.model('Plan', planSchema);

