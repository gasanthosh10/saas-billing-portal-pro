import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'Waiting', 'Resolved'], default: 'Open' }
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);

