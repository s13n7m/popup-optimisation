import { CADENCE, PHASE, type Card, type Stage } from '../types';

export interface Filters {
  cadence: string[];
  uiOnly: boolean;
  extrasOnly: boolean;
  hideDone: boolean;
}

export function visible(c: Card, f: Filters, done: Record<string, boolean>): boolean {
  if (f.cadence.length && !f.cadence.includes(c.cadence)) return false;
  if (f.uiOnly && !c.ui) return false;
  if (f.extrasOnly && !c.extra) return false;
  if (f.hideDone && done[c.id]) return false;
  return true;
}

interface Props {
  stages: Stage[];
  done: Record<string, boolean>;
  filters: Filters;
  onToggle: (id: string) => void;
  onOpen: (card: Card, stage: Stage) => void;
  onNavigate: (view: string) => void;
}

export function Board({ stages, done, filters, onToggle, onOpen, onNavigate }: Props) {
  return (
    <div className="board">
      {stages.map((s) => {
        const ph = PHASE[s.phase];
        const count = s.cards.filter((c) => done[c.id]).length;
        const shown = s.cards.filter((c) => visible(c, filters, done));
        return (
          <section key={s.id} className="stage" aria-labelledby={`h-${s.id}`}>
            <header className="stage-head" style={{ background: ph.head }}>
              <div className="eyebrow">
                <span>{s.eyebrow}</span>
                <span>{s.step}</span>
              </div>
              <h2 id={`h-${s.id}`}>
                <span className="badge" aria-hidden="true">{s.num}</span>
                {s.title}
              </h2>
              <p className="out">{s.out}</p>
              <p className="meta">
                <code>{s.branch}</code>
                <span>{count}/{s.cards.length} done</span>
              </p>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={s.cards.length} aria-valuenow={count} aria-label={`${s.title} progress`}>
                <div style={{ width: `${(count / s.cards.length) * 100}%` }} />
              </div>
              {s.id === 'build-the-data' && (
                <button className="btn small" onClick={() => onNavigate('data-sources')}>Open the data sources guide</button>
              )}
            </header>
            <ul className="cards">
              {shown.length === 0 && <li className="empty muted">No cards match the filters.</li>}
              {shown.map((c) => (
                <li key={c.id} className={`card${done[c.id] ? ' done' : ''}${c.extra ? ' extra' : ''}`} style={{ background: done[c.id] ? undefined : ph.tint }}>
                  <input
                    type="checkbox"
                    id={`t-${c.id}`}
                    checked={!!done[c.id]}
                    onChange={() => onToggle(c.id)}
                    aria-label={`Mark done: ${c.text}`}
                  />
                  <button className="card-main" onClick={() => onOpen(c, s)}>
                    <span className="text">{c.text}</span>
                    <span className="tags">
                      <span className="dot" style={{ background: CADENCE[c.cadence].color }} title={CADENCE[c.cadence].label}>{c.cadence}</span>
                      {c.ui && <span className="chip ui">Planner UI</span>}
                      {c.extra && <span className="chip">Extra</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="files" aria-label="Make targets and files">
              {s.files.map((f) => <div key={f}>{f}</div>)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
