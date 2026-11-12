import { buildOrder, stages } from '../content';

export function BuildOrder({ done }: { done: Record<string, boolean> }) {
  const progress = (id: string, stageIds: string[]) => {
    let cards = stages.filter((s) => stageIds.includes(s.id)).flatMap((s) => s.cards);
    if (id === 'p3') cards = cards.filter((c) => !c.ui);
    if (id === 'p4') cards = cards.filter((c) => c.ui);
    if (id === 'p6') return null;
    return { n: cards.filter((c) => done[c.id]).length, total: cards.length };
  };

  return (
    <div className="view">
      <h2 className="view-title">Build order</h2>
      <p className="lede">Seven phases. Reach each finish line before you start the next. Each phase ends on a stage branch you can preview on Vercel.</p>
      <ol className="phases">
        {buildOrder.map((p, i) => {
          const pr = progress(p.id, p.stageIds);
          return (
            <li key={p.id} className="phase">
              <div className="phase-head" style={{ background: p.color }}>
                <span className="eyebrow">PHASE {i} · {p.stages.toUpperCase()}</span>
                <h3>{p.name}</h3>
                {pr && (
                  <>
                    <span className="muted small">{pr.n}/{pr.total} cards done</span>
                    <div className="bar"><div style={{ width: `${pr.total ? (pr.n / pr.total) * 100 : 0}%` }} /></div>
                  </>
                )}
              </div>
              <div className="phase-body">
                <h4>Done when</h4>
                <p>{p.done}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
