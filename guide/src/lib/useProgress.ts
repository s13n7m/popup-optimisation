import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { GUIDE } from '../config';
import { supabase } from './supabase';

const KEY = `${GUIDE.storageKey}-progress-v1`;
export type SyncState = 'off' | 'idle' | 'saving' | 'error';

function loadLocal(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

/** Ticks live in localStorage as a cache and in Supabase (table progress) when signed in. */
export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>(loadLocal);
  const [session, setSession] = useState<Session | null>(null);
  const [sync, setSync] = useState<SyncState>(supabase ? 'idle' : 'off');
  const doneRef = useRef(done);
  doneRef.current = done;

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
    } catch {
      /* storage may be unavailable */
    }
  }, [done]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  // On sign-in: take the server copy, and push up any ticks that only exist locally.
  useEffect(() => {
    const sb = supabase;
    if (!sb || !session) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await sb.from('progress').select('card_id,done');
      if (cancelled) return;
      if (error || !data) {
        setSync('error');
        return;
      }
      const merged: Record<string, boolean> = {};
      data.forEach((r) => {
        merged[r.card_id as string] = r.done as boolean;
      });
      const push: { user_id: string; card_id: string; done: boolean }[] = [];
      for (const id in doneRef.current) {
        if (doneRef.current[id] && !(id in merged)) {
          merged[id] = true;
          push.push({ user_id: session.user.id, card_id: id, done: true });
        }
      }
      setDone(merged);
      if (push.length) {
        const res = await sb.from('progress').upsert(push, { onConflict: 'user_id,card_id' });
        if (res.error) setSync('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  const toggle = useCallback(
    (id: string) => {
      const next = !doneRef.current[id];
      setDone((d) => ({ ...d, [id]: next }));
      const sb = supabase;
      if (sb && session) {
        setSync('saving');
        void sb
          .from('progress')
          .upsert({ user_id: session.user.id, card_id: id, done: next, updated_at: new Date().toISOString() }, { onConflict: 'user_id,card_id' })
          .then(({ error }) => setSync(error ? 'error' : 'idle'));
      }
    },
    [session],
  );

  return { done, toggle, session, sync };
}
