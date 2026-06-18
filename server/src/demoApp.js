import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { generateToken } from './utils/generateToken.js';

const adminUser = {
  id: 'demo-admin',
  name: 'Aisha Kapoor',
  email: 'admin@billpilot.dev',
  role: 'Admin',
  avatarColor: '#111827'
};

const users = [
  adminUser,
  { id: 'demo-finance', name: 'Rohan Finance', email: 'finance@billpilot.dev', role: 'Finance', avatarColor: '#0f766e' },
  { id: 'demo-support', name: 'Nina Support', email: 'support@billpilot.dev', role: 'Support', avatarColor: '#c2410c' },
  {
    id: 'demo-customer',
    name: 'Dev Patel',
    email: 'customer@acme.dev',
    role: 'Customer',
    avatarColor: '#2563eb',
    company: { _id: 'company-acme', name: 'Acme Cloud', status: 'Active' }
  }
];

const plans = [
  {
    _id: 'plan-starter',
    name: 'Starter',
    description: 'For small teams launching their first SaaS workspace.',
    price: 49,
    interval: 'Monthly',
    seats: 5,
    features: ['Usage dashboard', 'Email support', 'Basic invoices']
  },
  {
    _id: 'plan-growth',
    name: 'Growth',
    description: 'Advanced billing and customer operations for growing teams.',
    price: 149,
    interval: 'Monthly',
    seats: 25,
    features: ['Role controls', 'Automated invoices', 'Revenue analytics', 'Priority support']
  },
  {
    _id: 'plan-scale',
    name: 'Scale',
    description: 'Enterprise controls, audit trails, and high volume billing.',
    price: 399,
    interval: 'Monthly',
    seats: 100,
    features: ['Advanced RBAC', 'Audit logs', 'Dedicated success manager', 'Custom limits']
  }
];

const companies = [
  { _id: 'company-acme', name: 'Acme Cloud', status: 'Active', billingEmail: 'billing@acme.dev' },
  { _id: 'company-northstar', name: 'Northstar CRM', status: 'Past Due', billingEmail: 'accounts@northstar.io' },
  { _id: 'company-brightdesk', name: 'BrightDesk', status: 'Trial', billingEmail: 'finance@brightdesk.app' },
  { _id: 'company-metricmint', name: 'MetricMint', status: 'Active', billingEmail: 'ops@metricmint.ai' }
];

let subscriptions = [
  {
    _id: 'sub-acme',
    company: companies[0],
    plan: plans[1],
    status: 'Active',
    seatsUsed: 18,
    renewalDate: new Date(Date.now() + 22 * 86400000)
  },
  {
    _id: 'sub-northstar',
    company: companies[1],
    plan: plans[2],
    status: 'Past Due',
    seatsUsed: 64,
    renewalDate: new Date(Date.now() - 4 * 86400000)
  },
  {
    _id: 'sub-brightdesk',
    company: companies[2],
    plan: plans[0],
    status: 'Trialing',
    seatsUsed: 3,
    renewalDate: new Date(Date.now() + 10 * 86400000)
  },
  {
    _id: 'sub-metricmint',
    company: companies[3],
    plan: plans[2],
    status: 'Active',
    seatsUsed: 81,
    renewalDate: new Date(Date.now() + 29 * 86400000)
  }
];

let invoices = [
  {
    _id: 'inv-1001',
    invoiceNumber: 'BP-01001',
    company: companies[0],
    subscription: subscriptions[0],
    amount: 149,
    tax: 26.82,
    status: 'Paid',
    dueDate: new Date(Date.now() - 10 * 86400000)
  },
  {
    _id: 'inv-1002',
    invoiceNumber: 'BP-01002',
    company: companies[1],
    subscription: subscriptions[1],
    amount: 399,
    tax: 71.82,
    status: 'Overdue',
    dueDate: new Date(Date.now() - 4 * 86400000)
  },
  {
    _id: 'inv-1003',
    invoiceNumber: 'BP-01003',
    company: companies[2],
    subscription: subscriptions[2],
    amount: 49,
    tax: 8.82,
    status: 'Open',
    dueDate: new Date(Date.now() + 7 * 86400000)
  },
  {
    _id: 'inv-1004',
    invoiceNumber: 'BP-01004',
    company: companies[3],
    subscription: subscriptions[3],
    amount: 399,
    tax: 71.82,
    status: 'Paid',
    dueDate: new Date(Date.now() - 2 * 86400000)
  },
  {
    _id: 'inv-1005',
    invoiceNumber: 'BP-01005',
    company: companies[0],
    subscription: subscriptions[0],
    amount: 149,
    tax: 26.82,
    status: 'Open',
    dueDate: new Date(Date.now() + 18 * 86400000)
  }
];

const payments = [
  { _id: 'pay-1001', invoice: invoices[0], company: companies[0], amount: 175.82, method: 'Card', status: 'Succeeded', createdAt: new Date() },
  { _id: 'pay-1002', invoice: invoices[3], company: companies[3], amount: 470.82, method: 'Bank Transfer', status: 'Succeeded', createdAt: new Date() }
];

const tickets = [
  { _id: 'ticket-1', company: companies[0], subject: 'Need invoice GST details added', priority: 'Medium', status: 'Open' },
  { _id: 'ticket-2', company: companies[1], subject: 'Payment failed on renewal', priority: 'High', status: 'Waiting' },
  { _id: 'ticket-3', company: companies[2], subject: 'Trial conversion question', priority: 'Low', status: 'Resolved' }
];

const auditLogs = [
  { _id: 'audit-1', actor: adminUser, action: 'created Scale plan', resource: 'Scale' },
  { _id: 'audit-2', actor: users[1], action: 'marked invoice paid', resource: 'BP-01004' },
  { _id: 'audit-3', actor: users[2], action: 'opened support ticket', resource: 'Payment failed on renewal' },
  { _id: 'audit-4', actor: users[3], action: 'viewed customer portal', resource: 'Acme Cloud' }
];

const buildSummary = () => {
  const openInvoices = invoices.filter((invoice) => ['Open', 'Overdue'].includes(invoice.status));
  const monthlyRecurringRevenue = subscriptions
    .filter((subscription) => ['Active', 'Trialing'].includes(subscription.status))
    .reduce((sum, subscription) => sum + subscription.plan.price, 0);

  return {
    metrics: {
      companies: companies.length,
      activeSubscriptions: subscriptions.filter((item) => item.status === 'Active').length,
      monthlyRecurringRevenue,
      paidRevenue: invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount + invoice.tax, 0),
      openBalance: openInvoices.reduce((sum, invoice) => sum + invoice.amount + invoice.tax, 0),
      overdueInvoices: invoices.filter((invoice) => invoice.status === 'Overdue').length
    },
    companies,
    plans,
    subscriptions,
    invoices,
    payments,
    tickets,
    users,
    auditLogs,
    invoiceStatus: ['Draft', 'Open', 'Paid', 'Overdue', 'Void'].map((status) => ({
      name: status,
      value: invoices.filter((invoice) => invoice.status === status).length
    })),
    revenueByMonth: [{ month: new Date().toLocaleString('en', { month: 'short' }), revenue: 646.64 }]
  };
};

export const createDemoApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'BillPilot Pro Demo API' }));

  app.post('/api/auth/login', (req, res) => {
    const user = users.find((item) => item.email === req.body.email);
    if (!user || req.body.password !== 'password123') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ user, token: generateToken(user.id) });
  });

  app.get('/api/auth/me', (_req, res) => res.json({ user: adminUser }));
  app.get('/api/dashboard/summary', (_req, res) => res.json(buildSummary()));
  app.get('/api/plans', (_req, res) => res.json(plans));
  app.get('/api/subscriptions', (_req, res) => res.json(subscriptions));
  app.get('/api/invoices', (_req, res) => res.json(invoices));
  app.get('/api/audit-logs', (_req, res) => res.json(auditLogs));

  app.patch('/api/subscriptions/:id', (req, res) => {
    subscriptions = subscriptions.map((subscription) =>
      subscription._id === req.params.id ? { ...subscription, ...req.body } : subscription
    );
    res.json(subscriptions.find((subscription) => subscription._id === req.params.id));
  });

  app.patch('/api/invoices/:id/pay', (req, res) => {
    invoices = invoices.map((invoice) =>
      invoice._id === req.params.id ? { ...invoice, status: 'Paid', paidAt: new Date(), method: req.body.method || 'Card' } : invoice
    );
    res.json(invoices.find((invoice) => invoice._id === req.params.id));
  });

  return app;
};

