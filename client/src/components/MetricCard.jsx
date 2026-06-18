import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({ icon: Icon, label, value, note, tone }) {
  return (
    <section className={`metric-card ${tone}`}>
      <div className="metric-icon">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{note}</span>
      </div>
      <ArrowUpRight className="trend" size={18} />
    </section>
  );
}

