import { CalendarDays, RefreshCcw } from 'lucide-react';

export default function SubscriptionList({ subscriptions, onStatus }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Accounts</span>
          <h2>Subscriptions</h2>
        </div>
      </div>
      <div className="subscription-list">
        {subscriptions.map((subscription) => (
          <article className="subscription-card" key={subscription._id}>
            <div>
              <span className={`status-pill ${subscription.status.toLowerCase().replace(' ', '-')}`}>{subscription.status}</span>
              <h3>{subscription.company?.name}</h3>
              <p>{subscription.plan?.name} plan · {subscription.seatsUsed}/{subscription.plan?.seats} seats used</p>
            </div>
            <div className="subscription-meta">
              <span>
                <CalendarDays size={15} />
                Renews {new Date(subscription.renewalDate).toLocaleDateString()}
              </span>
              {onStatus && (
                <button className="table-button" onClick={() => onStatus(subscription._id, subscription.status === 'Active' ? 'Past Due' : 'Active')}>
                  <RefreshCcw size={15} />
                  Toggle status
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

