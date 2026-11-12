import { useState } from 'react';
import type { Constraints, Plan } from '../api/types';

// TODO (stage 6): validation, presets, and a clear "reset to current plan" action.
export function WhatIf({ plan, constraints, busy, onApply }: {
  plan: Plan; constraints: Constraints; busy: boolean; onApply: (c: Constraints) => void;
}) {
  const [excluded, setExcluded] = useState<string[]>(constraints.excludedVenueIds);
  const [budget, setBudget] = useState(plan.budget);
  const [fleet, setFleet] = useState(plan.fleet);

  const toggle = (id: string) => setExcluded((x) => (x.includes(id) ? x.filter((v) => v !== id) : [...x, id]));

  return (
    <section>
      <h2>What if</h2>
      <p className="muted">Change the limits or skip a venue, then re-plan.</p>
      <div className="row">
        <label>Weekly budget<input type="number" value={budget} min={0} onChange={(e) => setBudget(Number(e.target.value))} /></label>
        <label>Cars available<input type="number" value={fleet} min={0} onChange={(e) => setFleet(Number(e.target.value))} /></label>
      </div>
      <fieldset>
        <legend>Skip these venues</legend>
        {plan.picks.map((p) => (
          <label key={p.venueId} className="check">
            <input type="checkbox" checked={excluded.includes(p.venueId)} onChange={() => toggle(p.venueId)} /> {p.name}
          </label>
        ))}
      </fieldset>
      <button className="primary" disabled={busy} onClick={() => onApply({ excludedVenueIds: excluded, budget, fleet })}>
        {busy ? 'Re-planning...' : 'Re-plan'}
      </button>
    </section>
  );
}
