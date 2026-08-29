import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { adminSignOut, isAdmin } from '../services/authService';
import { getUserProfile, updateUserProfile } from '../services/profileService';
import { uploadToCloudinary } from '../services/cloudinary';
import { routes } from '../config/business';

export default function Profile() {
  const navigate = useNavigate();
  const user = auth?.currentUser;
  const [name, setName] = useState(user?.displayName ?? '');
  const [phone, setPhone] = useState(user?.phoneNumber ?? '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [admin, setAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    let alive = true;
    getUserProfile(user.uid).then(profile => {
      if (!alive || !profile) return;
      setName(profile.name || user.displayName || '');
      setPhone(profile.phone || user.phoneNumber || '');
      setPhotoURL(profile.photoURL || user.photoURL || '');
    });
    isAdmin(user).then(value => alive && setAdmin(value)).catch(() => undefined);
    return () => { alive = false; };
  }, [navigate, user]);

  if (!user) return null;
  const initials = (name || user.email || 'U').trim().slice(0, 1).toUpperCase();

  async function uploadPhoto(file: File) {
    setUploading(true); setMessage('');
    try {
      const url = await uploadToCloudinary(file, 'duchess-hairline/profiles');
      setPhotoURL(url);
      await updateUserProfile(user!.uid, { name, phone, photoURL: url });
      setMessage('Profile photo uploaded successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not upload profile photo.');
    } finally { setUploading(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      await updateUserProfile(user!.uid, { name, phone, photoURL });
      setMessage('Profile updated successfully.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not update profile.'); }
    finally { setSaving(false); }
  }

  async function logout() { await adminSignOut(); navigate('/'); }

  return <main className="min-h-screen bg-warm-white pt-28 pb-mobile-nav px-4 md:px-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><p className="label-text text-charcoal/50">My account</p><h1 className="font-display text-4xl md:text-5xl text-deep-black">Profile</h1></div>
        <Link to={routes.home} className="rounded-full border border-beige/70 bg-white px-4 py-2 text-sm text-deep-black hover:bg-cream">← Back to website</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-deep-black p-6 text-white shadow-xl">
          <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white/10 text-2xl font-semibold">
            {photoURL ? <img src={photoURL} alt="Profile" className="h-full w-full object-cover" /> : initials}
          </div>
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
          <div className="mt-7 rounded-2xl border border-dashed border-beige/70 bg-warm-white p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-cream text-xl font-semibold text-deep-black">
                {photoURL ? <img src={photoURL} alt="Profile preview" className="h-full w-full object-cover" /> : initials}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-deep-black">Profile photo</p>
                <p className="mt-1 text-xs text-charcoal/50">Upload a square image. It will be stored in Cloudinary.</p>
                <label className="mt-3 inline-flex cursor-pointer rounded-full bg-deep-black px-4 py-2 text-xs text-white hover:opacity-80">
                  {uploading ? 'Uploading…' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void uploadPhoto(file); e.currentTarget.value = ''; }} />
                </label>
              </div>
            </div>
          </div>
          <label className="mt-5 block text-sm">Full name<input value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-beige/70 bg-warm-white p-3 outline-none focus:border-deep-black" placeholder="Your name" /></label>
          <label className="mt-4 block text-sm">Email address<input value={user.email ?? ''} disabled className="mt-2 w-full rounded-xl border border-beige/50 bg-cream/50 p-3 text-charcoal/60" /></label>
          <label className="mt-4 block text-sm">WhatsApp / phone<input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-beige/70 bg-warm-white p-3 outline-none focus:border-deep-black" placeholder="Phone number" /></label>
          {message && <p className="mt-4 rounded-xl bg-cream p-3 text-sm text-charcoal">{message}</p>}
          <button disabled={saving || uploading} className="mt-6 rounded-full bg-deep-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </div>
  </main>;
}
