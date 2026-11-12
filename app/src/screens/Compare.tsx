import type { Plan } from '../api/types';

// TODO (stage 5 and 6): compare against the greedy plan and last week's plan, not only the previous re-plan.
export function Compare({ current, previous }: { current: Plan; previous: Plan | null }) {
  if (!previous) {
    return (
      <section>
        <h2>Compare plans</h2>
        <p className="muted">Re-plan once from the What if tab to see a comparison with the earlier plan.</p>
      </section>
    );
  }
  const diff = current.totalExpectedCompletions - previous.totalExpectedCompletions;
  return (
    <section>
      <h2>Compare plans</h2>
      <p>
        Expected test drives: <strong>{previous.totalExpectedCompletions}</strong> before, <strong>{current.totalExpectedCompletions}</strong> now
        ({diff >= 0 ? '+' : ''}{diff}).
      </p>
      <p className="muted">Cost: {previous.totalCost} before, {current.totalCost} now.</p>
    </section>
  );
}
