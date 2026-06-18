import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['Card', 'Bank Transfer', 'UPI', 'Wallet'], default: 'Card' },
    status: { type: String, enum: ['Succeeded', 'Pending', 'Failed', 'Refunded'], default: 'Succeeded' },
    reference: { type: String, required: true }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);

