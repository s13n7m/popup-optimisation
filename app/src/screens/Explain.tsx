import type { Plan } from '../api/types';

// TODO (stage 3 to 6): real per-venue drivers from the model, written in plain language.
export function Explain({ plan }: { plan: Plan }) {
  return (
    <section>
      <h2>Why these venues</h2>
      <ul className="cards">
        {plan.picks.map((p) => (
          <li key={p.venueId} className="card">
            <h3>{p.name}</h3>
            <p className="muted">{p.reason === 'explore' ? 'Chosen to learn more about this kind of spot.' : 'Chosen because it should perform well.'}</p>
            <ul>
              {p.drivers.map((d) => (
                <li key={d.label}>{d.effect === 'up' ? '▲' : '▼'} {d.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
