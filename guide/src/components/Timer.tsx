import type { useTimer } from '../lib/useTimer';

const pad = (n: number) => String(n).padStart(2, '0');
const clock = (s: number) => `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
const hm = (s: number) => `${Math.floor(s / 3600)}h ${pad(Math.floor(s / 60) % 60)}m`;

export function Timer({ timer, signedIn }: { timer: ReturnType<typeof useTimer>; signedIn: boolean }) {
  const { running, today, total, sync, start, pause } = timer;
  const status =
    sync === 'local' ? 'saved on this device' : sync === 'saving' ? 'saving...' : sync === 'error' ? 'save failed' : signedIn ? 'synced' : 'sign in to sync';
  return (
    <div className={`timer${running ? ' on' : ''}`} role="group" aria-label="Work timer">
      <output className="clock" aria-label={`Time worked today ${clock(today)}`}>{clock(today)}</output>
      <button className="btn timer-btn" onClick={running ? pause : start} aria-pressed={running}>
        {running ? 'Pause' : 'Work'}
      </button>
      <p className="timer-extra">Worked today · All time {hm(total)} · {status}</p>
    </div>
  );
}
