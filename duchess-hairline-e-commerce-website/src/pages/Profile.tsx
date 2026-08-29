import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { adminSignOut, isAdmin } from '../services/authService';
import { getUserProfile, updateUserProfile } from '../services/profileService';
import { routes } from '../config/business';

export default function Profile() {
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const [name, setName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState(user?.phoneNumber ?? '');
  const [admin, setAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    let alive = true;
    getUserProfile(user.uid).then(profile => {
      if (!alive || !profile) return;
      setName(profile.name || user.displayName || '');
      setPhone(profile.phone || user.phoneNumber || '');
    });
    isAdmin(user).then(value => alive && setAdmin(value)).catch(() => undefined);
    return () => { alive = false; };
  }, [navigate, user]);

  if (!user) return null;
  const initials = (name || user.email || 'U').trim().slice(0, 1).toUpperCase();

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    try { await updateUserProfile(user!.uid, { name, phone }); setMessage('Profile updated successfully.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not update profile.'); }
    finally { setSaving(false); }
  }

  async function logout() { await adminSignOut(); navigate('/'); }

  return <main className="min-h-screen bg-warm-white pt-28 pb-20 px-4 md:px-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div><p className="label-text text-charcoal/50">My account</p><h1 className="font-display text-4xl md:text-5xl text-deep-black">Profile</h1></div>
        <Link to={routes.home} className="rounded-full border border-beige/70 bg-white px-4 py-2 text-sm text-deep-black hover:bg-cream">← Back to website</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-deep-black p-6 text-white shadow-xl">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/10 text-2xl font-semibold">{initials}</div>
          <h2 className="mt-5 text-xl font-semibold break-words">{name || 'Your profile'}</h2>
          <p className="mt-1 text-sm text-white/60 break-words">{user.email}</p>
          {admin && <span className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">Administrator</span>}
          <div className="mt-8 space-y-2">
            {admin && <Link to="/admin" className="block rounded-xl bg-white px-4 py-3 text-sm font-medium text-deep-black">Open Admin Dashboard</Link>}
            <Link to="/request" className="block rounded-xl border border-white/15 px-4 py-3 text-sm">Submit a request</Link>
            <button onClick={logout} className="w-full rounded-xl border border-white/15 px-4 py-3 text-left text-sm">Sign out</button>
          </div>
        </aside>
        <form onSubmit={save} className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-beige/40">
          <p className="label-text text-charcoal/50">Account details</p><h2 className="mt-1 text-2xl font-semibold">Your information</h2>
          <label className="mt-7 block text-sm">Full name<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-beige/70 bg-warm-white p-3 outline-none focus:border-deep-black" placeholder="Your name" /></label>
          <label className="mt-4 block text-sm">Email address<input value={user.email ?? ''} disabled className="mt-2 w-full rounded-xl border border-beige/50 bg-cream/50 p-3 text-charcoal/60" /></label>
          <label className="mt-4 block text-sm">WhatsApp / phone<input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-beige/70 bg-warm-white p-3 outline-none focus:border-deep-black" placeholder="Phone number" /></label>
          {message && <p className="mt-4 rounded-xl bg-cream p-3 text-sm text-charcoal">{message}</p>}
          <button disabled={saving} className="mt-6 rounded-full bg-deep-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  </main>;
}
