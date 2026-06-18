import Avatar from './Avatar.jsx';

export default function AuditFeed({ logs }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Security</span>
          <h2>Audit trail</h2>
        </div>
      </div>
      <div className="audit-feed">
        {logs.map((log) => (
          <article className="audit-item" key={log._id}>
            <Avatar user={log.actor} size={32} />
            <div>
              <p>
                <strong>{log.actor?.name}</strong> {log.action}
              </p>
              <span>{log.resource}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

