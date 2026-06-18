import { AuditLog } from '../models/AuditLog.js';
import { Company } from '../models/Company.js';
import { Invoice } from '../models/Invoice.js';
import { Payment } from '../models/Payment.js';
import { Plan } from '../models/Plan.js';
import { Subscription } from '../models/Subscription.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';

const customerFilter = (user) => (user.role === 'Customer' ? { company: user.company?._id } : {});

export const getSummary = async (req, res, next) => {
  try {
    const filter = customerFilter(req.user);
    const [companies, plans, subscriptions, invoices, payments, tickets, users, auditLogs] = await Promise.all([
      Company.find(filter).sort({ createdAt: -1 }),
      Plan.find().sort({ price: 1 }),
      Subscription.find(filter).populate('company', 'name status').populate('plan', 'name price interval seats').sort({ createdAt: -1 }),
      Invoice.find(filter).populate('company', 'name status').populate('subscription').sort({ dueDate: 1 }),
      Payment.find(filter).populate('invoice', 'invoiceNumber').populate('company', 'name').sort({ createdAt: -1 }),
      Ticket.find(filter).populate('company', 'name').populate('requester', 'name email').sort({ createdAt: -1 }),
      User.find(filter).populate('company', 'name').select('name email role avatarColor company'),
      ['Admin', 'Finance'].includes(req.user.role)
        ? AuditLog.find().populate('actor', 'name role avatarColor').sort({ createdAt: -1 }).limit(10)
        : []
    ]);

    const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid');
    const openInvoices = invoices.filter((invoice) => ['Open', 'Overdue'].includes(invoice.status));
    const monthlyRecurringRevenue = subscriptions
      .filter((subscription) => ['Active', 'Trialing'].includes(subscription.status))
      .reduce((sum, subscription) => sum + (subscription.plan?.price || 0), 0);

    const invoiceStatus = ['Draft', 'Open', 'Paid', 'Overdue', 'Void'].map((status) => ({
      name: status,
      value: invoices.filter((invoice) => invoice.status === status).length
    }));

    const revenueByMonth = payments.reduce((rows, payment) => {
      const month = new Date(payment.createdAt).toLocaleString('en', { month: 'short' });
      const existing = rows.find((row) => row.month === month);
      if (existing) existing.revenue += payment.amount;
      else rows.push({ month, revenue: payment.amount });
      return rows;
    }, []);

    res.json({
      metrics: {
        companies: companies.length,
        activeSubscriptions: subscriptions.filter((item) => item.status === 'Active').length,
        monthlyRecurringRevenue,
        paidRevenue: paidInvoices.reduce((sum, invoice) => sum + invoice.amount + invoice.tax, 0),
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
      invoiceStatus,
      revenueByMonth
    });
  } catch (error) {
    next(error);
  }
};
