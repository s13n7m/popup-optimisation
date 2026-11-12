import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { GUIDE } from '../config';
import { supabase } from './supabase';

export interface WorkSession { id: string; startedAt: string; seconds: number }
interface Active { id: string; startedAt: number; lastBeat: number }
interface Stored { sessions: WorkSession[]; active: Active | null }
export type TimerSync = 'local' | 'idle' | 'saving' | 'error';

const KEY = `${GUIDE.storageKey}-timer-v1`;
const secs = (from: number, to: number) => Math.max(0, Math.floor((to - from) / 1000));
const iso = (ms: number) => new Date(ms).toISOString();

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function load(): Stored {
  let s: Stored = { sessions: [], active: null };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && Array.isArray(raw.sessions)) s = raw;
  } catch {
    /* ignore a corrupt cache */
  }
  // The page closed without pausing (crash, killed tab): keep the time up to the last heartbeat.
  if (s.active) {
    const a = s.active;
    s = { sessions: [...s.sessions, { id: a.id, startedAt: iso(a.startedAt), seconds: secs(a.startedAt, a.lastBeat) }], active: null };
  }
  return s;
}

/**
 * Work timer. Time is measured from timestamps, so throttled background tabs cannot drift it.
 * It pauses when the page is hidden or closing. Sessions are cached locally and saved to
 * Supabase (table work_sessions) while signed in.
 */
export function useTimer(auth: Session | null) {
  const [store, setStore] = useState<Stored>(load);
  const [now, setNow] = useState(() => Date.now());
  const [sync, setSync] = useState<TimerSync>(supabase ? 'idle' : 'local');
  const storeRef = useRef(store);
  const authRef = useRef(auth);
  const lastPush = useRef(0);
  authRef.current = auth;

  const persist = useCallback((s: Stored) => {
    storeRef.current = s;
    setStore(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const push = useCallback(async (rows: WorkSession[]) => {
    const sb = supabase;
    const a = authRef.current;
    if (!sb || !a || !rows.length) return;
    setSync('saving');
    const { error } = await sb.from('work_sessions').upsert(
      rows.map((r) => ({ id: r.id, user_id: a.user.id, started_at: r.startedAt, seconds: r.seconds, updated_at: new Date().toISOString() })),
      { onConflict: 'id' },
    );
    setSync(error ? 'error' : 'idle');
  }, []);

  const start = useCallback(() => {
    if (storeRef.current.active) return;
    const t = Date.now();
    lastPush.current = t;
    persist({ ...storeRef.current, active: { id: newId(), startedAt: t, lastBeat: t } });
    setNow(t);
  }, [persist]);

  const pause = useCallback(() => {
    const s = storeRef.current;
    if (!s.active) return;
    const t = Date.now();
    const done: WorkSession = { id: s.active.id, startedAt: iso(s.active.startedAt), seconds: secs(s.active.startedAt, t) };
    persist({ sessions: [...s.sessions.filter((x) => x.id !== done.id), done], active: null });
    void push([done]);
  }, [persist, push]);

  // Tick the clock, keep a local heartbeat, and save the running session every 15 seconds.
  const activeId = store.active?.id;
  useEffect(() => {
    if (!activeId) return;
    const timer = setInterval(() => {
      const a = storeRef.current.active;
      if (!a) return;
      const t = Date.now();
      setNow(t);
      if (t - a.lastBeat >= 5000) persist({ ...storeRef.current, active: { ...a, lastBeat: t } });
      if (t - lastPush.current >= 15000) {
        lastPush.current = t;
        void push([{ id: a.id, startedAt: iso(a.startedAt), seconds: secs(a.startedAt, t) }]);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeId, persist, push]);

  // Leaving the page pauses the timer.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') pause();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', pause);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', pause);
    };
  }, [pause]);

  // On sign-in: merge the server copy with this device, and push anything the server lacks.
  const userId = auth?.user.id;
  useEffect(() => {
    const sb = supabase;
    if (!sb || !userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await sb.from('work_sessions').select('id,started_at,seconds');
      if (cancelled) return;
      if (error || !data) {
        setSync('error');
        return;
      }
      const merged = new Map<string, WorkSession>();
      data.forEach((r) => merged.set(r.id as string, { id: r.id as string, startedAt: r.started_at as string, seconds: r.seconds as number }));
      const cur = storeRef.current;
      const toPush: WorkSession[] = [];
      cur.sessions.forEach((l) => {
        const r = merged.get(l.id);
        if (!r || l.seconds > r.seconds) {
          merged.set(l.id, l);
          toPush.push(l);
        }
      });
      persist({ ...cur, sessions: [...merged.values()] });
      void push(toPush);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, persist, push]);

  const activeSec = store.active ? secs(store.active.startedAt, now) : 0;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const sum = (list: WorkSession[]) => list.reduce((n, s) => n + s.seconds, 0);

  return {
    running: !!store.active,
    session: activeSec,
    today: sum(store.sessions.filter((s) => new Date(s.startedAt).getTime() >= startOfDay.getTime())) + activeSec,
    total: sum(store.sessions) + activeSec,
    sync,
    start,
    pause,
  };
}
