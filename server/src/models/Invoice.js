import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    amount: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Open', 'Paid', 'Overdue', 'Void'], default: 'Open' },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model('Invoice', invoiceSchema);

