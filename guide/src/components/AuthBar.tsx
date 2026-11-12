import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { SyncState } from '../lib/useProgress';

export function AuthBar({ session, sync }: { session: Session | null; sync: SyncState }) {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const sb = supabase;

  if (!sb) {
    return <p className="auth muted">Ticks save in this browser only. Add the Supabase keys to sync them across devices.</p>;
  }
  if (session) {
    const label = sync === 'saving' ? 'Saving...' : sync === 'error' ? 'Could not save, try again' : 'Synced';
    return (
      <p className="auth">
        {session.user.email} · {label}{' '}
        <button className="link" onClick={() => void sb.auth.signOut()}>Sign out</button>
      </p>
    );
  }
  return (
    <form
      className="auth"
      onSubmit={async (e) => {
        e.preventDefault();
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + window.location.pathname } });
        setMsg(error ? error.message : 'Check your email for the sign-in link.');
      }}
    >
      <label htmlFor="auth-email" className="sr">Email</label>
      <input id="auth-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" className="btn">Email me a sign-in link</button>
      {msg && <span role="status" className="muted">{msg}</span>}
    </form>
  );
}
