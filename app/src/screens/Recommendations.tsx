import type { Plan } from '../api/types';

// TODO (stage 6): add a map view, sorting, and a market and week picker.
export function Recommendations({ plan }: { plan: Plan }) {
  return (
    <section>
      <h2>Recommended venues</h2>
      <p className="muted">
        Expected completions this week: <strong>{plan.totalExpectedCompletions}</strong> · Predictions updated {new Date(plan.dataAsOf).toLocaleDateString()}
      </p>
      {plan.usedFallback && <p className="banner">This plan used a faster, simpler method because the full one took too long.</p>}
      <div className="scroll-x">
        <table>
          <thead>
            <tr><th>Venue</th><th>Area</th><th>Cars</th><th>Expected test drives</th><th>Confidence</th><th>Type</th></tr>
          </thead>
          <tbody>
            {plan.picks.map((p) => (
              <tr key={p.venueId}>
                <td>{p.name}</td><td>{p.area}</td><td>{p.cars}</td><td>{p.expectedCompletions}</td>
                <td>{p.confidence}</td><td>{p.reason === 'explore' ? 'Trying something new' : 'Proven spot'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
