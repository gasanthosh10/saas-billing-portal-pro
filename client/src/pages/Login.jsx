import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Building2, Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const demoAccounts = [
  ['Admin', 'admin@billpilot.dev'],
  ['Finance', 'finance@billpilot.dev'],
  ['Support', 'support@billpilot.dev'],
  ['Customer', 'customer@acme.dev']
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@billpilot.dev');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Start the API and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand-mark">BP</div>
        <h1>BillPilot Pro</h1>
        <p>Role-based SaaS billing operations for subscriptions, invoices, payments, and account health.</p>
        <div className="hero-proof">
          <span>
            <ShieldCheck size={18} />
            RBAC secured
          </span>
          <span>
            <Building2 size={18} />
            Multi-company billing
          </span>
          <span>
            <BadgeCheck size={18} />
            Audit-ready workflows
          </span>
        </div>
      </section>
      <section className="login-card">
        <span className="eyebrow">Secure workspace</span>
        <h2>Sign in</h2>
        <form onSubmit={submit}>
          <label>
            Email
            <span className="input-shell">
              <Mail size={18} />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
            </span>
          </label>
          <label>
            Password
            <span className="input-shell">
              <LockKeyhole size={18} />
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
            </span>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : null}
            Continue
          </button>
        </form>
        <div className="demo-switcher">
          {demoAccounts.map(([label, account]) => (
            <button key={account} onClick={() => setEmail(account)}>
              {label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

