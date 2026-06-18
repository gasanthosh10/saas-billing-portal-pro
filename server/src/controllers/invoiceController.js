import { AuditLog } from '../models/AuditLog.js';
import { Invoice } from '../models/Invoice.js';
import { Payment } from '../models/Payment.js';
import { HttpError } from '../utils/httpError.js';

const populate = (query) => query.populate('company', 'name status billingEmail').populate('subscription');

export const getInvoices = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Customer' ? { company: req.user.company?._id } : {};
    res.json(await populate(Invoice.find(filter)).sort({ dueDate: 1 }));
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const count = await Invoice.countDocuments();
    const invoice = await Invoice.create({
      ...req.body,
      invoiceNumber: `BP-${String(count + 1001).padStart(5, '0')}`,
      status: 'Open'
    });

    await AuditLog.create({ actor: req.user._id, action: 'created invoice', resource: invoice.invoiceNumber });
    res.status(201).json(await populate(Invoice.findById(invoice._id)));
  } catch (error) {
    next(error);
  }
};

export const payInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw new HttpError('Invoice not found', 404);
    if (invoice.status === 'Paid') throw new HttpError('Invoice is already paid', 409);
    if (req.user.role === 'Customer' && invoice.company.toString() !== req.user.company?._id.toString()) {
      throw new HttpError('You can only pay invoices for your own company', 403);
    }

    invoice.status = 'Paid';
    invoice.paidAt = new Date();
    await invoice.save();

    await Payment.create({
      invoice: invoice._id,
      company: invoice.company,
      amount: invoice.amount + invoice.tax,
      method: req.body.method || 'Card',
      reference: `PAY-${Date.now()}`
    });

    await AuditLog.create({ actor: req.user._id, action: 'paid invoice', resource: invoice.invoiceNumber });
    res.json(await populate(Invoice.findById(invoice._id)));
  } catch (error) {
    next(error);
  }
};
