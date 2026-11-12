import { useEffect, useState } from 'react';
import { replan } from './api/client';
import type { Constraints, Plan } from './api/types';
import { Recommendations } from './screens/Recommendations';
import { WhatIf } from './screens/WhatIf';
import { Explain } from './screens/Explain';
import { Compare } from './screens/Compare';

const TABS = ['Recommendations', 'What if', 'Why these venues', 'Compare plans'] as const;
type Tab = (typeof TABS)[number];

export function App() {
  const [tab, setTab] = useState<Tab>('Recommendations');
  const [market] = useState('London');
  const [constraints, setConstraints] = useState<Constraints>({ excludedVenueIds: [] });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [previous, setPrevious] = useState<Plan | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(c: Constraints) {
    setBusy(true);
    setError(null);
    try {
      const next = await replan(market, c);
      setPrevious(plan);
      setPlan(next);
      setConstraints(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void run(constraints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="shell">
      <header className="top">
        <h1>Pop-up Planner</h1>
        <p className="muted">{market} · week of {plan?.week ?? '...'}</p>
      </header>
      <nav className="tabs" aria-label="Planner sections">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? 'tab on' : 'tab'} aria-current={t === tab} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      <main>
        {error && <p role="alert" className="error">{error}</p>}
        {busy && <p role="status" className="muted">Working out the best plan...</p>}
        {plan && tab === 'Recommendations' && <Recommendations plan={plan} />}
        {plan && tab === 'What if' && <WhatIf plan={plan} constraints={constraints} busy={busy} onApply={run} />}
        {plan && tab === 'Why these venues' && <Explain plan={plan} />}
        {plan && tab === 'Compare plans' && <Compare current={plan} previous={previous} />}
      </main>
    </div>
  );
}
