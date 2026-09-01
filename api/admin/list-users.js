import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'duchess-hairline';
const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

function adminApp() {
  if (getApps().length) return getApps()[0];
  if (!SERVICE_ACCOUNT_JSON) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');
  const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
  return initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID });
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.end(JSON.stringify(body));
}

async function requireAdmin(req) {
  const app = adminApp();
  const appCheckToken = req.headers['x-firebase-appcheck'];
  if (!appCheckToken) throw Object.assign(new Error('App Check token required.'), { status: 401 });
  await getAppCheck(app).verifyToken(appCheckToken);

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) throw Object.assign(new Error('Authorization token required.'), { status: 401 });
  const idToken = authHeader.slice(7).trim();
  const decoded = await getAuth(app).verifyIdToken(idToken, true);
  const adminSnap = await getFirestore(app).collection('admins').doc(decoded.uid).get();
  if (!adminSnap.exists || adminSnap.data()?.role !== 'admin' || adminSnap.data()?.active !== true) {
    throw Object.assign(new Error('Admin access required.'), { status: 403 });
  }
  return { app, uid: decoded.uid };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed.' });
  try {
    const { app } = await requireAdmin(req);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const users = [];
    let page = await auth.listUsers(1000);
    while (page) {
      users.push(...page.users);
      if (!page.pageToken) break;
      page = await auth.listUsers(1000, page.pageToken);
    }

    const profiles = new Map();
    const chunks = [];
    const refs = users.map(user => firestore.collection('users').doc(user.uid));
    for (let i = 0; i < refs.length; i += 100) chunks.push(refs.slice(i, i + 100));
    for (const chunk of chunks) {
      if (!chunk.length) continue;
      const docs = await firestore.getAll(...chunk);
      docs.forEach(doc => { if (doc.exists) profiles.set(doc.id, doc.data()); });
    }

    const result = users.map(user => {
      const profile = profiles.get(user.uid) || {};
      return {
        id: user.uid,
        uid: user.uid,
        email: user.email || '',
        name: profile.name || user.displayName || '',
        phone: profile.phone || user.phoneNumber || '',
        photoURL: profile.photoURL || user.photoURL || '',
        disabled: !!user.disabled,
        emailVerified: !!user.emailVerified,
        provider: user.providerData?.map(p => p.providerId).join(', ') || 'unknown',
        createdAt: user.metadata?.creationTime || null,
        lastSignInAt: user.metadata?.lastSignInTime || null,
      };
    }).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    return send(res, 200, { users: result, count: result.length });
  } catch (error) {
    console.error('admin/list-users:', error);
    const status = error?.status || (error?.code === 'auth/id-token-revoked' ? 401 : 500);
    return send(res, status, { error: error?.message || 'Could not load Firebase Authentication users.' });
  }
}
