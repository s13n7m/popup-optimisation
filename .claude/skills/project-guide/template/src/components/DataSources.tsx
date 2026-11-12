import { useState } from 'react';
import { GUIDE } from '../config';
import { dataSources, venueColumns } from '../content';

function CopyCode({ text, lang }: { text: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code">
      <button
        className="btn small"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard may be blocked */
          }
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre aria-label={`${lang} example`}><code>{text}</code></pre>
    </div>
  );
}

export function DataSources() {
  return (
    <div className="view">
      <h2 className="view-title">{GUIDE.reference.title}</h2>
      <p className="lede">{GUIDE.reference.intro}</p>

      <h3>{GUIDE.reference.tableHeading}</h3>
      <div className="scroll-x">
        <table>
          <thead><tr><th>Column</th><th>Source</th><th>Note</th></tr></thead>
          <tbody>
            {venueColumns.map((r) => (
              <tr key={r.column}><td><code>{r.column}</code></td><td>{r.source}</td><td>{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>{GUIDE.reference.listHeading}</h3>
      {dataSources.map((s, i) => (
        <details key={s.id} className="source" open={i === 0}>
          <summary>
            <strong>{s.name}</strong>
            <span className="muted"> · {s.role}</span>
            <span className="chip">{s.cost}</span>
          </summary>
          <div className="source-body">
            <p><strong>Feeds:</strong> {s.feeds}</p>
            <h4>What you get</h4>
            <ul>{s.gives.map((g) => <li key={g}>{g}</li>)}</ul>
            <h4>Steps</h4>
            <ol>{s.steps.map((g) => <li key={g}>{g}</li>)}</ol>
            {s.code && <CopyCode text={s.code.text} lang={s.code.lang} />}
            <h4>Watch out for</h4>
            <ul>{s.catches.map((g) => <li key={g}>{g}</li>)}</ul>
            <p><a href={s.docs.url} target="_blank" rel="noreferrer">{s.docs.label}</a></p>
          </div>
        </details>
      ))}
    </div>
  );
}
