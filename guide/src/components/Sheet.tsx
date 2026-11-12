import { useEffect, useRef } from 'react';
import { CADENCE, type Card, type Stage } from '../types';

interface Props {
  card: Card;
  stage: Stage;
  done: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export function Sheet({ card, stage, done, onToggle, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <aside className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-top">
          <p className="muted">Stage {stage.num}: {stage.title} · branch <code>{stage.branch}</code></p>
          <button ref={closeRef} className="btn small" onClick={onClose}>Close</button>
        </div>
        <h2 id="sheet-title">{card.text}</h2>
        <p className="tags">
          <span className="dot" style={{ background: CADENCE[card.cadence].color }}>{card.cadence}</span>
          <span>{CADENCE[card.cadence].label}</span>
          {card.ui && <span className="chip ui">Planner UI</span>}
          {card.extra && <span className="chip">Extra practice</span>}
        </p>
        <h3>Do this</h3>
        <ol>{card.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <h3>Done when</h3>
        <p>{card.done}</p>
        <h3>Files and commands</h3>
        <p className="files inline">{stage.files.map((f) => <span key={f}>{f}</span>)}</p>
        {stage.id === 'build-the-data' && (
          <p><button className="btn" onClick={() => { onClose(); onNavigate('data-sources'); }}>Open the data sources guide</button></p>
        )}
        <label className="mark">
          <input type="checkbox" checked={done} onChange={onToggle} /> Mark as done
        </label>
      </aside>
    </div>
  );
}
