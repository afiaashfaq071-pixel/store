import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Lock } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import Button from '../common/Button.jsx';
import { MIN_KEY_LENGTH, checkAdminKey, hasAdminKey, isUnlocked, setAdminKey, setUnlocked } from '../../utils/adminKey.js';
import { hasSession, isSupabaseEnabled, signIn, signOut } from '../../lib/supabase.js';

export const AdminLockContext = createContext({ lock: () => {} });

/**
 * Lock screen in front of the whole admin area.
 * - With Supabase configured: the owner signs in with the email + password made in Supabase.
 * - Without it: first visit creates a secret key in this browser, later visits ask for it.
 */
export default function AdminGate({ children }) {
  const [open, setOpen] = useState(() => (isSupabaseEnabled ? hasSession() : isUnlocked()));
  const [keyExists, setKeyExists] = useState(() => hasAdminKey());
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const lock = useCallback(() => {
    if (isSupabaseEnabled) signOut();
    else setUnlocked(false);
    setOpen(false);
    setKey('');
    setConfirm('');
  }, []);

  // The Supabase login can expire; go back to the lock screen when it does.
  useEffect(() => {
    if (!isSupabaseEnabled) return undefined;
    const onExpired = () => setOpen(false);
    window.addEventListener('ahs-session-expired', onExpired);
    return () => window.removeEventListener('ahs-session-expired', onExpired);
  }, []);

  const ctx = useMemo(() => ({ lock }), [lock]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSupabaseEnabled) {
      if (!email.trim() || !key) return setError('Enter your email and password.');
      setBusy(true);
      try {
        await signIn(email, key);
        setOpen(true);
        setKey('');
      } catch {
        setError('Wrong email or password.');
      } finally {
        setBusy(false);
      }
      return undefined;
    }

    if (keyExists) {
      if (!checkAdminKey(key)) return setError('That key is not correct.');
    } else {
      if (key.trim().length < MIN_KEY_LENGTH) return setError(`Use at least ${MIN_KEY_LENGTH} characters for the key.`);
      if (key !== confirm) return setError('The two keys do not match.');
      if (!setAdminKey(key)) return setError('Could not save the key in this browser.');
      setKeyExists(true);
    }
    setUnlocked(true);
    setOpen(true);
    setKey('');
    setConfirm('');
    return undefined;
  };

  if (open) return <AdminLockContext.Provider value={ctx}>{children}</AdminLockContext.Provider>;

  const creating = !isSupabaseEnabled && !keyExists;
  const title = isSupabaseEnabled ? 'Owner login' : keyExists ? 'Owner access' : 'Create your owner key';
  const text = isSupabaseEnabled
    ? 'Sign in with the owner email and password.'
    : keyExists
      ? 'Enter your secret key to open the admin area.'
      : 'Choose a secret key. Only you should know it — you will need it every time you open the admin area.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form onSubmit={submit} noValidate className="w-full max-w-sm rounded-3xl bg-surface p-7 shadow-soft">
        <div className="mb-5 flex justify-center"><Logo variant="stacked" to="/" /></div>
        <div className="mb-1 flex items-center justify-center gap-2 text-lg font-extrabold">
          {creating ? <KeyRound className="h-5 w-5 text-brand" /> : <Lock className="h-5 w-5 text-brand" />}
          {title}
        </div>
        <p className="mb-5 text-center text-sm text-ink/60">{text}</p>

        {isSupabaseEnabled && (
          <>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold">Email</label>
            <input id="admin-email" type="email" autoFocus autoComplete="username" className="input-field mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
          </>
        )}

        <label htmlFor="admin-key" className="mb-1 block text-sm font-semibold">{isSupabaseEnabled ? 'Password' : keyExists ? 'Secret key' : 'New key'}</label>
        <input id="admin-key" type="password" autoFocus={!isSupabaseEnabled} autoComplete={creating ? 'new-password' : 'current-password'} className="input-field" value={key} onChange={(e) => setKey(e.target.value)} />

        {creating && (
          <>
            <label htmlFor="admin-key2" className="mb-1 mt-4 block text-sm font-semibold">Repeat key</label>
            <input id="admin-key2" type="password" autoComplete="new-password" className="input-field" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </>
        )}

        {error && <p className="mt-3 text-sm text-red-500" role="alert">{error}</p>}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
          {busy ? 'Signing in…' : isSupabaseEnabled ? 'Sign in' : keyExists ? 'Open admin' : 'Save key and open'}
        </Button>
        <Link to="/" className="mt-4 block text-center text-sm font-semibold text-brand hover:underline">← Back to store</Link>
        {!isSupabaseEnabled && keyExists && <p className="mt-4 text-center text-[11px] text-ink/40">Forgot the key? Clearing this site's data in your browser lets you create a new one (it also clears products saved here).</p>}
      </form>
    </div>
  );
}
