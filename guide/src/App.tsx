import { useCallback, useEffect, useMemo, useState } from 'react';
import { allCards, stages } from './content';
import { Board, type Filters } from './components/Board';
import { Sheet } from './components/Sheet';
import { DataSources } from './components/DataSources';
import { BuildOrder } from './components/BuildOrder';
import { AuthBar } from './components/AuthBar';
import { useProgress } from './lib/useProgress';
import { CADENCE, type Card, type Stage } from './types';

const VIEWS = [
  { id: 'board', label: 'Stages' },
  { id: 'data-sources', label: 'Data sources' },
  { id: 'build-order', label: 'Build order' },
] as const;

function fromHash(): string {
  const h = window.location.hash.replace('#', '');
  return VIEWS.some((v) => v.id === h) ? h : 'board';
}

export function App() {
  const { done, toggle, session, sync } = useProgress();
  const [view, setView] = useState(fromHash);
  const [open, setOpen] = useState<{ card: Card; stage: Stage } | null>(null);
  const [filters, setFilters] = useState<Filters>({ cadence: [], uiOnly: false, extrasOnly: false, hideDone: false });

  useEffect(() => {
    const on = () => setView(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const navigate = useCallback((v: string) => {
    window.location.hash = v;
    setView(v);
    window.scrollTo({ top: 0 });
  }, []);

  const total = allCards.length;
  const count = useMemo(() => allCards.filter((c) => done[c.id]).length, [done]);
  const closeSheet = useCallback(() => setOpen(null), []);

  const toggleCadence = (k: string) =>
    setFilters((f) => ({ ...f, cadence: f.cadence.includes(k) ? f.cadence.filter((x) => x !== k) : [...f.cadence, k] }));

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1>Pop-up build guide</h1>
          <p className="muted">Your step-by-step guide to building the predict-then-decide planner, one branch per stage.</p>
        </div>
        <div className="top-right">
          <div className="overall" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count} aria-label="Overall progress">
            <div className="bar big"><div style={{ width: `${(count / total) * 100}%` }} /></div>
            <span>{count} of {total} cards done</span>
          </div>
          <AuthBar session={session} sync={sync} />
        </div>
      </header>

      <nav className="tabs" aria-label="Guide sections">
        {VIEWS.map((v) => (
          <button key={v.id} className={v.id === view ? 'tab on' : 'tab'} aria-current={v.id === view ? 'page' : undefined} onClick={() => navigate(v.id)}>
            {v.label}
          </button>
        ))}
      </nav>

      {view === 'board' && (
        <>
          <div className="filters" role="group" aria-label="Filter cards">
            <span className="muted">Show:</span>
            {(Object.keys(CADENCE) as (keyof typeof CADENCE)[]).map((k) => (
              <button key={k} className="chip-btn" aria-pressed={filters.cadence.includes(k)} onClick={() => toggleCadence(k)}>
                <span className="dot" style={{ background: CADENCE[k].color }}>{k}</span> {CADENCE[k].label}
              </button>
            ))}
            <button className="chip-btn" aria-pressed={filters.uiOnly} onClick={() => setFilters((f) => ({ ...f, uiOnly: !f.uiOnly }))}>Planner UI only</button>
            <button className="chip-btn" aria-pressed={filters.extrasOnly} onClick={() => setFilters((f) => ({ ...f, extrasOnly: !f.extrasOnly }))}>Extras only</button>
            <button className="chip-btn" aria-pressed={filters.hideDone} onClick={() => setFilters((f) => ({ ...f, hideDone: !f.hideDone }))}>Hide done</button>
          </div>
          <Board stages={stages} done={done} filters={filters} onToggle={toggle} onNavigate={navigate} onOpen={(card, stage) => setOpen({ card, stage })} />
        </>
      )}
      {view === 'data-sources' && <DataSources />}
      {view === 'build-order' && <BuildOrder done={done} />}

      {open && (
        <Sheet card={open.card} stage={open.stage} done={!!done[open.card.id]} onToggle={() => toggle(open.card.id)} onClose={closeSheet} onNavigate={navigate} />
      )}
    </div>
  );
}
