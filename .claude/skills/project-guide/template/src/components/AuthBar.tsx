import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { SyncState } from '../lib/useProgress';

/**
 * Email sign-in with a one-time code. The code works from any device: request it on the
 * laptop, read the email on the phone, type the code on the laptop. A sign-in link in the
 * same email still works, but mail apps can pre-open links and use them up.
 */
export function AuthBar({ session, sync }: { session: Session | null; sync: SyncState }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const sb = supabase;

  // A used or expired link comes back as #error=... in the address bar. Explain it and tidy the URL.
  useEffect(() => {
    const h = window.location.hash;
    if (h.includes('error_code') || h.includes('error=')) {
      setMsg('That sign-in link expired or was already used. Enter your email to get a code instead.');
      window.history.replaceState(null, '', window.location.pathname + '#board');
    }
  }, []);

  if (!sb) {
    return <p className="auth muted">Everything saves in this browser only. Add the Supabase keys to sync it across devices.</p>;
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

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin + window.location.pathname } });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setStep('code');
    setMsg(`We emailed a code to ${email.trim()}. It can take a minute to arrive.`);
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) {
      setMsg('That code is wrong or has expired. Check it, or request a new one.');
      return;
    }
    setCode('');
    setStep('email');
    setMsg('');
  }

  if (step === 'code') {
    return (
      <form className="auth" onSubmit={verify}>
        <label htmlFor="auth-code" className="sr">Sign-in code</label>
        <input
          id="auth-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6,10}"
          required
          placeholder="Code from the email"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
        <button type="button" className="link" onClick={() => { setStep('email'); setCode(''); setMsg(''); }}>Use a different email</button>
        {msg && <span role="status" className="muted">{msg}</span>}
      </form>
    );
  }

  return (
    <form className="auth" onSubmit={sendCode}>
      <label htmlFor="auth-email" className="sr">Email</label>
      <input id="auth-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" className="btn" disabled={busy}>{busy ? 'Sending...' : 'Email me a code'}</button>
      {msg && <span role="status" className="muted">{msg}</span>}
    </form>
  );
}
