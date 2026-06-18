import { CreditCard, FileText } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function InvoiceTable({ invoices, onPay, canPay }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Billing</span>
          <h2>Invoices</h2>
        </div>
      </div>
      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Company</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>
                  <span className="invoice-id">
                    <FileText size={16} />
                    {invoice.invoiceNumber}
                  </span>
                </td>
                <td>{invoice.company?.name}</td>
                <td>{currency.format(invoice.amount + invoice.tax)}</td>
                <td>
                  <span className={`status-pill ${invoice.status.toLowerCase()}`}>{invoice.status}</span>
                </td>
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>
                  {invoice.status !== 'Paid' && canPay ? (
                    <button className="table-button" onClick={() => onPay(invoice._id)}>
                      <CreditCard size={15} />
                      Pay
                    </button>
                  ) : (
                    <span className="muted">No action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

