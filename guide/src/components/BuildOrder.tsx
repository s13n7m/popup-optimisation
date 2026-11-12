import { buildOrder, stages } from '../content';

export function BuildOrder({ done }: { done: Record<string, boolean> }) {
  const progress = (p: (typeof buildOrder)[number]) => {
    if (p.ongoing) return null;
    let cards = stages.filter((s) => p.stageIds.includes(s.id)).flatMap((s) => s.cards);
    if (p.only === 'thread') cards = cards.filter((c) => c.ui);
    if (p.only === 'rest') cards = cards.filter((c) => !c.ui);
    return { n: cards.filter((c) => done[c.id]).length, total: cards.length };
  };

  return (
    <div className="view">
      <h2 className="view-title">Build order</h2>
      <p className="lede">{buildOrder.length} phases. Reach each finish line before you start the next. Each phase ends on a stage branch you can preview on Vercel.</p>
      <ol className="phases">
        {buildOrder.map((p, i) => {
          const pr = progress(p);
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
