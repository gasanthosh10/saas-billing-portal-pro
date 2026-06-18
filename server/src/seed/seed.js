import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { AuditLog } from '../models/AuditLog.js';
import { Company } from '../models/Company.js';
import { Invoice } from '../models/Invoice.js';
import { Payment } from '../models/Payment.js';
import { Plan } from '../models/Plan.js';
import { Subscription } from '../models/Subscription.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';

dotenv.config();

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const run = async () => {
  await connectDb(process.env.MONGO_URI);
  await Promise.all([
    AuditLog.deleteMany(),
    Payment.deleteMany(),
    Invoice.deleteMany(),
    Subscription.deleteMany(),
    Plan.deleteMany(),
    Ticket.deleteMany(),
    User.deleteMany(),
    Company.deleteMany()
  ]);

  const companies = await Company.create([
    { name: 'Acme Cloud', domain: 'acme.dev', status: 'Active', billingEmail: 'billing@acme.dev', industry: 'Developer Tools' },
    { name: 'Northstar CRM', domain: 'northstar.io', status: 'Past Due', billingEmail: 'accounts@northstar.io', industry: 'Sales' },
    { name: 'BrightDesk', domain: 'brightdesk.app', status: 'Trial', billingEmail: 'finance@brightdesk.app', industry: 'Support' },
    { name: 'MetricMint', domain: 'metricmint.ai', status: 'Active', billingEmail: 'ops@metricmint.ai', industry: 'Analytics' }
  ]);

  const plans = await Plan.create([
    {
      name: 'Starter',
      description: 'For small teams launching their first SaaS workspace.',
      price: 49,
      interval: 'Monthly',
      seats: 5,
      features: ['Usage dashboard', 'Email support', 'Basic invoices']
    },
    {
      name: 'Growth',
      description: 'Advanced billing and customer operations for growing teams.',
      price: 149,
      interval: 'Monthly',
      seats: 25,
      features: ['Role controls', 'Automated invoices', 'Revenue analytics', 'Priority support']
    },
    {
      name: 'Scale',
      description: 'Enterprise controls, audit trails, and high volume billing.',
      price: 399,
      interval: 'Monthly',
      seats: 100,
      features: ['Advanced RBAC', 'Audit logs', 'Dedicated success manager', 'Custom limits']
    }
  ]);

  const users = await User.create([
    { name: 'Aisha Kapoor', email: 'admin@billpilot.dev', password: 'password123', role: 'Admin', avatarColor: '#111827' },
    { name: 'Rohan Finance', email: 'finance@billpilot.dev', password: 'password123', role: 'Finance', avatarColor: '#0f766e' },
    { name: 'Nina Support', email: 'support@billpilot.dev', password: 'password123', role: 'Support', avatarColor: '#c2410c' },
    { name: 'Dev Patel', email: 'customer@acme.dev', password: 'password123', role: 'Customer', company: companies[0]._id, avatarColor: '#2563eb' },
    { name: 'Maya Rao', email: 'maya@northstar.io', password: 'password123', role: 'Customer', company: companies[1]._id, avatarColor: '#7c3aed' }
  ]);

  const [admin, finance, support, acmeUser, northstarUser] = users;

  const subscriptions = await Subscription.create([
    { company: companies[0]._id, plan: plans[1]._id, status: 'Active', seatsUsed: 18, renewalDate: addDays(22) },
    { company: companies[1]._id, plan: plans[2]._id, status: 'Past Due', seatsUsed: 64, renewalDate: addDays(-4) },
    { company: companies[2]._id, plan: plans[0]._id, status: 'Trialing', seatsUsed: 3, renewalDate: addDays(10) },
    { company: companies[3]._id, plan: plans[2]._id, status: 'Active', seatsUsed: 81, renewalDate: addDays(29) }
  ]);

  const invoices = await Invoice.create([
    {
      invoiceNumber: 'BP-01001',
      company: companies[0]._id,
      subscription: subscriptions[0]._id,
      amount: 149,
      tax: 26.82,
      status: 'Paid',
      dueDate: addDays(-10),
      paidAt: addDays(-9)
    },
    {
      invoiceNumber: 'BP-01002',
      company: companies[1]._id,
      subscription: subscriptions[1]._id,
      amount: 399,
      tax: 71.82,
      status: 'Overdue',
      dueDate: addDays(-4)
    },
    {
      invoiceNumber: 'BP-01003',
      company: companies[2]._id,
      subscription: subscriptions[2]._id,
      amount: 49,
      tax: 8.82,
      status: 'Open',
      dueDate: addDays(7)
    },
    {
      invoiceNumber: 'BP-01004',
      company: companies[3]._id,
      subscription: subscriptions[3]._id,
      amount: 399,
      tax: 71.82,
      status: 'Paid',
      dueDate: addDays(-2),
      paidAt: addDays(-1)
    },
    {
      invoiceNumber: 'BP-01005',
      company: companies[0]._id,
      subscription: subscriptions[0]._id,
      amount: 149,
      tax: 26.82,
      status: 'Open',
      dueDate: addDays(18)
    }
  ]);

  await Payment.create([
    { invoice: invoices[0]._id, company: companies[0]._id, amount: 175.82, method: 'Card', status: 'Succeeded', reference: 'PAY-DEMO-1001' },
    { invoice: invoices[3]._id, company: companies[3]._id, amount: 470.82, method: 'Bank Transfer', status: 'Succeeded', reference: 'PAY-DEMO-1002' }
  ]);

  await Ticket.create([
    { company: companies[0]._id, requester: acmeUser._id, subject: 'Need invoice GST details added', priority: 'Medium', status: 'Open' },
    { company: companies[1]._id, requester: northstarUser._id, subject: 'Payment failed on renewal', priority: 'High', status: 'Waiting' },
    { company: companies[2]._id, requester: support._id, subject: 'Trial conversion question', priority: 'Low', status: 'Resolved' }
  ]);

  await AuditLog.create([
    { actor: admin._id, action: 'created Scale plan', resource: 'Scale' },
    { actor: finance._id, action: 'marked invoice paid', resource: 'BP-01004' },
    { actor: support._id, action: 'opened support ticket', resource: 'Payment failed on renewal' },
    { actor: acmeUser._id, action: 'viewed customer portal', resource: 'Acme Cloud' }
  ]);

  console.log('Seed complete');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

