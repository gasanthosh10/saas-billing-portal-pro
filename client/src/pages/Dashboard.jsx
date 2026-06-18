import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CreditCard,
  FileText,
  LifeBuoy,
  LogOut,
  Receipt,
  Search,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import AuditFeed from '../components/AuditFeed.jsx';
import { InvoiceStatusChart, RevenueChart } from '../components/Charts.jsx';
import InvoiceTable from '../components/InvoiceTable.jsx';
import MetricCard from '../components/MetricCard.jsx';
import PlanCards from '../components/PlanCards.jsx';
import SubscriptionList from '../components/SubscriptionList.jsx';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const emptySummary = {
  metrics: {
    companies: 0,
    activeSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    paidRevenue: 0,
    openBalance: 0,
    overdueInvoices: 0
  },
  companies: [],
  plans: [],
  subscriptions: [],
  invoices: [],
  payments: [],
  tickets: [],
  users: [],
  auditLogs: [],
  invoiceStatus: [],
  revenueByMonth: []
};

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(emptySummary);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    const { data } = await api.get('/dashboard/summary');
    setSummary(data);
  }, []);

  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, [fetchSummary]);

  const visibleInvoices = useMemo(() => {
    return summary.invoices.filter((invoice) => {
      const haystack = `${invoice.invoiceNumber} ${invoice.company?.name} ${invoice.status}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [query, summary.invoices]);

  const canManageBilling = ['Admin', 'Finance'].includes(user?.role);

  const payInvoice = async (id) => {
    await api.patch(`/invoices/${id}/pay`, { method: 'Card' });
    await fetchSummary();
  };

  const toggleSubscription = async (id, status) => {
    await api.patch(`/subscriptions/${id}`, { status });
    await fetchSummary();
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>BP</span>
          <strong>BillPilot Pro</strong>
        </div>
        <nav>
          <a className="active" href="#overview">
            <TrendingUp size={18} />
            Overview
          </a>
          <a href="#invoices">
            <Receipt size={18} />
            Invoices
          </a>
          <a href="#subscriptions">
            <CreditCard size={18} />
            Subscriptions
          </a>
          <a href="#support">
            <LifeBuoy size={18} />
            Support
          </a>
        </nav>
        <div className="role-panel">
          <Avatar user={user} />
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role} access</span>
          </div>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">{user?.role} portal</span>
            <h1>{user?.role === 'Customer' ? 'Customer billing center' : 'SaaS billing command center'}</h1>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search invoices" />
            </div>
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={19} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">Loading billing portal...</div>
        ) : (
          <>
            <section className="metrics-grid" id="overview">
              <MetricCard icon={Building2} label="Companies" value={summary.metrics.companies} note="billing accounts" tone="blue" />
              <MetricCard icon={CreditCard} label="Active subs" value={summary.metrics.activeSubscriptions} note="renewing now" tone="green" />
              <MetricCard icon={TrendingUp} label="MRR" value={money.format(summary.metrics.monthlyRecurringRevenue)} note="monthly run-rate" tone="dark" />
              <MetricCard icon={FileText} label="Open balance" value={money.format(summary.metrics.openBalance)} note={`${summary.metrics.overdueInvoices} overdue`} tone="orange" />
            </section>

            <div className="dashboard-grid">
              <div className="main-stack">
                <InvoiceTable invoices={visibleInvoices} onPay={payInvoice} canPay={canManageBilling || user?.role === 'Customer'} />
                <SubscriptionList subscriptions={summary.subscriptions} onStatus={canManageBilling ? toggleSubscription : null} />
              </div>
              <div className="side-stack">
                <InvoiceStatusChart data={summary.invoiceStatus} />
                <RevenueChart data={summary.revenueByMonth} />
              </div>
            </div>

            <div className="lower-grid">
              <PlanCards plans={summary.plans} />
              {canManageBilling ? (
                <AuditFeed logs={summary.auditLogs} />
              ) : (
                <section className="panel">
                  <div className="section-heading compact">
                    <div>
                      <span>Access</span>
                      <h2>Customer permissions</h2>
                    </div>
                  </div>
                  <div className="permission-list">
                    <span>
                      <ShieldCheck size={18} />
                      View invoices and payment status
                    </span>
                    <span>
                      <ShieldCheck size={18} />
                      Pay open invoices securely
                    </span>
                    <span>
                      <ShieldCheck size={18} />
                      Review current subscription details
                    </span>
                  </div>
                </section>
              )}
            </div>

            <section className="panel support-panel" id="support">
              <div className="section-heading compact">
                <div>
                  <span>Support</span>
                  <h2>Billing tickets</h2>
                </div>
              </div>
              <div className="ticket-grid">
                {summary.tickets.map((ticket) => (
                  <article className="ticket-card" key={ticket._id}>
                    <span className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.company?.name} · {ticket.priority} priority</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

