import type { CSSProperties } from 'react';
import { GUIDE } from '../config';
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
  expanded: Record<string, boolean>;
  collapsed: Record<string, boolean>;
  filters: Filters;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onToggleStage: (id: string) => void;
  onNavigate: (view: string) => void;
}

export function Board({ stages, done, expanded, collapsed, filters, onToggle, onExpand, onToggleStage, onNavigate }: Props) {
  return (
    <div className="board">
      {stages.map((s) => {
        const ph = PHASE[s.phase];
        const count = s.cards.filter((c) => done[c.id]).length;
        const shown = s.cards.filter((c) => visible(c, filters, done));
        const isCollapsed = !!collapsed[s.id];
        return (
          <section key={s.id} className={`stage${isCollapsed ? ' collapsed' : ''}`} aria-labelledby={`h-${s.id}`} style={{ '--tint': ph.tint, '--head': ph.head } as CSSProperties}>
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
              <div className="head-actions">
                <button className="btn small" aria-expanded={!isCollapsed} aria-controls={`body-${s.id}`} onClick={() => onToggleStage(s.id)}>
                  {isCollapsed ? 'Expand stage' : 'Collapse stage'}
                </button>
                {GUIDE.referenceStageId && s.id === GUIDE.referenceStageId && (
                  <button className="btn small" onClick={() => onNavigate('data-sources')}>{GUIDE.reference.tabLabel}</button>
                )}
              </div>
            </header>
            {!isCollapsed && (
            <div id={`body-${s.id}`} className="stage-body">
            <ul className="cards">
              {shown.length === 0 && <li className="empty muted">No cards match the filters.</li>}
              {shown.map((c) => {
                const open = !!expanded[c.id];
                return (
                  <li key={c.id} className={`card${done[c.id] ? ' done' : ''}${c.extra ? ' extra' : ''}${open ? ' open' : ''}`}>
                    <input
                      type="checkbox"
                      id={`t-${c.id}`}
                      checked={!!done[c.id]}
                      onChange={() => onToggle(c.id)}
                      aria-label={`Mark done: ${c.text}`}
                    />
                    <button className="card-main" aria-expanded={open} aria-controls={`d-${c.id}`} onClick={() => onExpand(c.id)}>
                      <span className="text">{c.text}</span>
                      <span className="tags">
                        <span className="dot" style={{ background: CADENCE[c.cadence].color }} title={CADENCE[c.cadence].label}>{c.cadence}</span>
                        {c.ui && <span className="chip ui">{GUIDE.threadLabel}</span>}
                        {c.extra && <span className="chip">Extra</span>}
                        <span className="chev" aria-hidden="true">{open ? '−' : '+'}</span>
                      </span>
                    </button>
                    {open && (
                      <div id={`d-${c.id}`} className="detail">
                        <h4>Do this</h4>
                        <ol>{c.steps.map((st) => <li key={st}>{st}</li>)}</ol>
                        <h4>Done when</h4>
                        <p>{c.done}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="files" aria-label="Make targets and files">
              {s.files.map((f) => <div key={f}>{f}</div>)}
            </div>
            </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
