import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function adminApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw Object.assign(new Error('Firebase server credentials are not configured in Vercel Production.'), { status: 500, code: 'config/missing-service-account' });

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw Object.assign(new Error('Firebase server credentials contain invalid JSON.'), { status: 500, code: 'config/invalid-service-account-json' });
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw Object.assign(new Error('Firebase service account is incomplete. It must contain project_id, client_email and private_key.'), { status: 500, code: 'config/incomplete-service-account' });
  }

  // Use the project ID from the service account itself. This prevents a stale
  // FIREBASE_PROJECT_ID environment variable from pointing Admin SDK at a
  // different Firebase project than the credentials belong to.
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
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
  if (!appCheckToken) throw Object.assign(new Error('Firebase App Check token required.'), { status: 401, code: 'app-check/missing' });

  try {
    await getAppCheck(app).verifyToken(appCheckToken);
  } catch (error) {
    console.error('admin/list-users App Check:', error);
    throw Object.assign(new Error('Firebase App Check verification failed. Refresh the page and try again.'), { status: 401, code: error?.code || 'app-check/invalid' });
  }

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) throw Object.assign(new Error('Authorization token required.'), { status: 401, code: 'auth/missing-token' });

  let decoded;
  try {
    decoded = await getAuth(app).verifyIdToken(authHeader.slice(7).trim(), true);
  } catch (error) {
    console.error('admin/list-users ID token:', error);
    throw Object.assign(new Error('Your admin Firebase session is no longer valid. Sign out and sign in again.'), { status: 401, code: error?.code || 'auth/invalid-token' });
  }

  try {
    const adminSnap = await getFirestore(app).collection('admins').doc(decoded.uid).get();
    if (!adminSnap.exists || adminSnap.data()?.role !== 'admin' || adminSnap.data()?.active !== true) {
      throw Object.assign(new Error('Admin access required.'), { status: 403, code: 'admin/forbidden' });
    }
  } catch (error) {
    if (error?.status) throw error;
    console.error('admin/list-users admin document:', error);
    throw Object.assign(new Error(`Could not verify the admin account in Firestore: ${error?.message || 'unknown Firestore error'}`), { status: 500, code: error?.code || 'firestore/admin-check-failed' });
  }

  return { app };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed.' });

  try {
    const { app } = await requireAdmin(req);
    const auth = getAuth(app);
    const users = [];

    try {
      let page = await auth.listUsers(1000);
      while (page) {
        users.push(...page.users);
        if (!page.pageToken) break;
        page = await auth.listUsers(1000, page.pageToken);
      }
    } catch (error) {
      console.error('admin/list-users Firebase Auth listUsers:', error);
      throw Object.assign(
        new Error(`Firebase Authentication user listing failed: ${error?.message || 'unknown Firebase Auth error'}`),
        { status: 500, code: error?.code || 'auth/list-users-failed' },
      );
    }

    const result = users.map(user => ({
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      phone: user.phoneNumber || '',
      photoURL: user.photoURL || '',
      disabled: !!user.disabled,
      emailVerified: !!user.emailVerified,
      provider: user.providerData?.map(p => p.providerId).join(', ') || 'unknown',
      createdAt: user.metadata?.creationTime || null,
      lastSignInAt: user.metadata?.lastSignInTime || null,
    })).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    return send(res, 200, { users: result, count: result.length });
  } catch (error) {
    console.error('admin/list-users:', error);
    const status = Number.isInteger(error?.status) ? error.status : 500;
    return send(res, status, {
      error: error?.message || 'Could not load Firebase Authentication users.',
      code: error?.code || 'admin/list-users-failed',
    });
  }
}
