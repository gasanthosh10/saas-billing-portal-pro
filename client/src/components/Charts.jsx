import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#2563eb', '#0f766e', '#111827', '#c2410c', '#7c3aed'];

export function InvoiceStatusChart({ data }) {
  return (
    <section className="panel chart-panel">
      <div className="section-heading compact">
        <div>
          <span>Collections</span>
          <h2>Invoice status</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={4}>
            {data.map((item, index) => (
              <Cell fill={colors[index % colors.length]} key={item.name} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}

export function RevenueChart({ data }) {
  return (
    <section className="panel chart-panel">
      <div className="section-heading compact">
        <div>
          <span>Revenue</span>
          <h2>Payment trend</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data.length ? data : [{ month: 'Now', revenue: 0 }]}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

