import { useCallback, useEffect, useMemo, useState } from 'react';
import { allCards, stages } from './content';
import { Board, type Filters } from './components/Board';
import { Timer } from './components/Timer';
import { DataSources } from './components/DataSources';
import { BuildOrder } from './components/BuildOrder';
import { AuthBar } from './components/AuthBar';
import { useProgress } from './lib/useProgress';
import { useTimer } from './lib/useTimer';
import { GUIDE } from './config';
import { CADENCE } from './types';

const VIEWS = [
  { id: 'board', label: 'Stages' },
  { id: 'data-sources', label: GUIDE.reference.tabLabel },
  { id: 'build-order', label: 'Build order' },
] as const;

function fromHash(): string {
  const h = window.location.hash.replace('#', '');
  return VIEWS.some((v) => v.id === h) ? h : 'board';
}

export function App() {
  const { done, toggle, session, sync } = useProgress();
  const timer = useTimer(session);
  const [view, setView] = useState(fromHash);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(`${GUIDE.storageKey}-collapsed-v1`) || '{}');
    } catch {
      return {};
    }
  });
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

  useEffect(() => {
    document.title = GUIDE.title;
  }, []);

  const total = allCards.length;
  const count = useMemo(() => allCards.filter((c) => done[c.id]).length, [done]);
  const toggleExpand = useCallback((id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] })), []);
  const setStages = useCallback((next: Record<string, boolean>) => {
    setCollapsed(next);
    try {
      localStorage.setItem(`${GUIDE.storageKey}-collapsed-v1`, JSON.stringify(next));
    } catch {
      /* storage may be unavailable */
    }
  }, []);
  const toggleStage = useCallback((id: string) => setStages({ ...collapsed, [id]: !collapsed[id] }), [collapsed, setStages]);

  const toggleCadence = (k: string) =>
    setFilters((f) => ({ ...f, cadence: f.cadence.includes(k) ? f.cadence.filter((x) => x !== k) : [...f.cadence, k] }));

  return (
    <div className="page">
      <header className="top">
        <div>
          <div className="title-row">
            <h1>{GUIDE.title}</h1>
            <Timer timer={timer} signedIn={!!session} />
          </div>
          <p className="muted">{GUIDE.subtitle}</p>
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
            <button className="chip-btn" aria-pressed={filters.uiOnly} onClick={() => setFilters((f) => ({ ...f, uiOnly: !f.uiOnly }))}>{GUIDE.threadLabel} only</button>
            <button className="chip-btn" aria-pressed={filters.extrasOnly} onClick={() => setFilters((f) => ({ ...f, extrasOnly: !f.extrasOnly }))}>Extras only</button>
            <button className="chip-btn" aria-pressed={filters.hideDone} onClick={() => setFilters((f) => ({ ...f, hideDone: !f.hideDone }))}>Hide done</button>
            <span className="spacer" />
            <button className="btn small" onClick={() => setStages({})}>Expand all stages</button>
            <button className="btn small" onClick={() => setStages(Object.fromEntries(stages.map((s) => [s.id, true])))}>Collapse all stages</button>
          </div>
          <Board stages={stages} done={done} expanded={expanded} collapsed={collapsed} filters={filters} onToggle={toggle} onExpand={toggleExpand} onToggleStage={toggleStage} onNavigate={navigate} />
        </>
      )}
      {view === 'data-sources' && <DataSources />}
      {view === 'build-order' && <BuildOrder done={done} />}

    </div>
  );
}
