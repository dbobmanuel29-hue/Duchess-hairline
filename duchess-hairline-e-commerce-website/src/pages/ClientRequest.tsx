import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { subscribeToAuth } from '../services/authService';
import { createInquiry } from '../services/inquiryService';
import SeoHead from '../components/SeoHead';

export default function ClientRequest() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth?.currentUser ?? null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [productName, setProductName] = useState('');
  const [source, setSource] = useState('Website');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => subscribeToAuth(current => setUser(current)), []);
  useEffect(() => { if (user?.displayName && !name) setName(user.displayName); }, [user, name]);

  if (!user) {
    return <main className="min-h-screen bg-warm-white pt-28 px-4 pb-20"><SeoHead title="Client Request — Duchess Hairline" description="Sign in to send a client request to Duchess Hairline." /><div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-xl text-center"><p className="label-text text-charcoal/50">Duchess Hairline</p><h1 className="mt-3 font-display text-4xl font-light">Sign in to send your request.</h1><p className="mt-4 text-sm leading-7 text-charcoal/60">Please sign in or create a customer account first. This lets Duchess Hairline securely identify your request and reply to you.</p><button onClick={() => navigate('/login?returnTo=%2Frequest')} className="mt-7 w-full rounded-xl bg-black p-3 text-white">Sign in / Create account</button><Link to="/" className="mt-4 inline-block text-sm underline">Back to store</Link></div></main>;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await createInquiry({ name, phone, productName: productName.trim() || undefined, message, source });
      setSent(true); setMessage(''); setProductName('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not send your request.'); }
    finally { setBusy(false); }
  };

  return <main className="min-h-screen bg-warm-white pt-28 px-4 pb-24 md:px-8"><SeoHead title="Client Request — Duchess Hairline" description="Send a client request or wig enquiry to Duchess Hairline." /><div className="mx-auto max-w-2xl"><div className="mb-10"><p className="label-text text-charcoal/50">Client Requests</p><h1 className="mt-3 font-display text-5xl md:text-6xl font-light leading-none">Tell us what<br />you need.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-charcoal/60">Your request is securely attached to your signed-in customer account, so the Duchess Hairline team can see who sent it.</p></div>{sent ? <section className="rounded-3xl bg-white p-8 md:p-10 shadow-sm"><div className="grid h-14 w-14 place-items-center rounded-full bg-black text-white">✓</div><h2 className="mt-6 text-2xl font-semibold">Request sent.</h2><p className="mt-3 text-sm leading-7 text-charcoal/60">Your request has been saved. The Duchess Hairline team can now see your name, email, phone number and request details in the admin dashboard.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setSent(false)} className="rounded-xl bg-black px-5 py-3 text-sm text-white">Send another</button><Link to="/" className="rounded-xl border px-5 py-3 text-sm">Back to store</Link></div></section> : <form onSubmit={submit} className="rounded-3xl bg-white p-6 md:p-10 shadow-sm"><div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-medium">Full name<input required value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" placeholder="Your name" /></label><label className="text-sm font-medium">WhatsApp / phone<input required value={phone} onChange={e => setPhone(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" placeholder="081..." /></label></div><label className="mt-5 block text-sm font-medium">Wig / product (optional)<input value={productName} onChange={e => setProductName(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" placeholder="Which style are you asking about?" /></label><label className="mt-5 block text-sm font-medium">How did you find us?<select value={source} onChange={e => setSource(e.target.value)} className="mt-2 w-full rounded-xl border border-neutral-200 p-3"><option>Website</option><option>TikTok</option><option>Google</option><option>Instagram</option><option>Referral</option><option>Other</option></select></label><label className="mt-5 block text-sm font-medium">Your request<textarea required minLength={5} value={message} onChange={e => setMessage(e.target.value)} rows={7} className="mt-2 w-full resize-y rounded-xl border border-neutral-200 p-3 outline-none focus:border-black" placeholder="Tell us the wig/style you want, questions you have, or what you would like to discuss." /></label>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-xl bg-black p-3 text-white disabled:opacity-50">{busy ? 'Sending…' : 'Send Client Request'}</button><p className="mt-4 text-xs leading-5 text-charcoal/40">Signed in as {user.email || user.displayName || 'your account'}. Your account identity is stored with this request.</p></form>}</div></main>;
}
