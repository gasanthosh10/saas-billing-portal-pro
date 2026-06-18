import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Trial', 'Active', 'Past Due', 'Canceled'], default: 'Trial' },
    billingEmail: { type: String, required: true, lowercase: true, trim: true },
    industry: { type: String, default: 'SaaS' }
  },
  { timestamps: true }
);

export const Company = mongoose.model('Company', companySchema);

