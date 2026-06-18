import { CheckCircle2 } from 'lucide-react';

export default function PlanCards({ plans }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Catalog</span>
          <h2>Subscription plans</h2>
        </div>
      </div>
      <div className="plan-grid">
        {plans.map((plan) => (
          <article className="plan-card" key={plan._id}>
            <div>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>
            <strong>
              ${plan.price}
              <span>/{plan.interval}</span>
            </strong>
            <div className="feature-list">
              {plan.features?.map((feature) => (
                <span key={feature}>
                  <CheckCircle2 size={15} />
                  {feature}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

