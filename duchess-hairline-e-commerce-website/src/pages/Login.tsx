import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firebaseConfigured } from '../services/firebase';
import { adminSignIn, adminSignInWithGoogle, registerWithEmail, registerWithGoogle } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  if (!firebaseConfigured) {
    return <main className="min-h-screen grid place-items-center bg-warm-white p-6"><div className="max-w-md rounded-2xl bg-white p-8 shadow"><h1 className="text-2xl font-semibold">Account access unavailable</h1><p className="mt-3 text-sm text-neutral-600">Firebase is not connected yet. Configure the VITE_FIREBASE_* variables in Vercel and redeploy.</p></div></main>;
  }

  const clearMessages = () => { setError(''); setNotice(''); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    setBusy(true);
    try {
      if (mode === 'signin') {
        await adminSignIn(email, password);
        navigate('/admin', { replace: true });
      } else {
        const result = await registerWithEmail(email, password);
        setNotice(`Account created successfully. Your Firebase UID is ${result.uid}. Send this UID to the site administrator so they can authorize you as an admin.`);
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    clearMessages();
    setBusy(true);
    try {
      if (mode === 'signin') {
        await adminSignInWithGoogle();
        navigate('/admin', { replace: true });
      } else {
        const result = await registerWithGoogle();
        setNotice(`Google account created. Your Firebase UID is ${result.uid}. Send this UID to the site administrator so they can authorize you as an admin.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-warm-white px-4 py-24 md:px-8">
      <div className="mx-auto grid min-h-[70vh] max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <p className="label-text text-charcoal/50">Duchess Hairline</p>
          <h1 className="mt-4 font-display text-6xl font-light leading-none text-deep-black">Owner access.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-charcoal/70">Sign in to the private store dashboard, or create your owner account first. Dashboard access is granted only after the Firebase administrator authorizes your account.</p>
        </div>

        <section className="mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-xl md:p-8">
          <div className="mb-7">
            <p className="label-text text-charcoal/50">Duchess Hairline</p>
            <h2 className="mt-2 text-3xl font-semibold text-deep-black">{mode === 'signin' ? 'Admin sign in' : 'Create owner account'}</h2>
            <p className="mt-2 text-sm text-charcoal/60">{mode === 'signin' ? 'Private store management area.' : 'Create an account, then have the Firebase administrator add your UID to the admins collection.'}</p>
          </div>

          <form onSubmit={submit}>
            <label className="block text-sm font-medium text-deep-black">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" /></label>
            <label className="mt-4 block text-sm font-medium text-deep-black">Password<input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="mt-2 w-full rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" /></label>
            <button disabled={busy} className="mt-5 w-full rounded-xl bg-black p-3 text-white disabled:opacity-50">{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-neutral-400"><span className="h-px flex-1 bg-neutral-200" /><span>OR</span><span className="h-px flex-1 bg-neutral-200" /></div>
          <button type="button" disabled={busy} onClick={google} className="w-full rounded-xl border border-neutral-200 p-3 text-sm font-medium text-deep-black hover:border-black disabled:opacity-50">Continue with Google</button>

          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 break-words">{error}</p>}
          {notice && <p className="mt-4 rounded-xl bg-neutral-100 p-3 text-sm text-neutral-700 break-words">{notice}</p>}

          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <button type="button" onClick={() => { clearMessages(); setMode(mode === 'signin' ? 'signup' : 'signin'); }} className="underline underline-offset-4">{mode === 'signin' ? 'Create an account' : 'Already have an account? Sign in'}</button>
            <Link to="/" className="text-neutral-500 hover:text-black">Back to store</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
