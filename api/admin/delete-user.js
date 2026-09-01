import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

function setHeaders(res, origin) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Firebase-AppCheck');
    res.setHeader('Access-Control-Max-Age', '600');
    res.setHeader('Vary', 'Origin');
  }
}

function send(res, status, body, origin) {
  setHeaders(res, origin);
  return res.status(status).json(body);
}

function getServiceAccount() {
  if (!SERVICE_ACCOUNT_JSON) throw new Error('Server-side Firebase credentials are not configured yet.');
  try {
    const account = JSON.parse(SERVICE_ACCOUNT_JSON);
    if (!account.client_email || !account.private_key || !account.project_id) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing required service-account fields.');
    }
    return account;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.');
    throw error;
  }
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccount = getServiceAccount();
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

async function verifyAppCheckToken(token) {
  if (!token) throw new Error('App Check token required.');
  await getAppCheck(getAdminApp()).verifyToken(token);
}

function errorDetails(error) {
  return {
    code: typeof error?.code === 'string' ? error.code : 'unknown',
    message: error instanceof Error ? error.message : 'User deletion failed.',
  };
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (req.method === 'OPTIONS') {
    setHeaders(res, origin);
    return res.status(204).end();
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' }, origin);
  if (!SERVICE_ACCOUNT_JSON) {
    return send(res, 503, {
      error: 'Server-side Firebase credentials are not configured yet.',
      code: 'server/missing-service-account',
    }, origin);
  }

  const authorization = req.headers.authorization || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!idToken) return send(res, 401, { error: 'Authentication required.' }, origin);

  // App Check remains required for this custom backend endpoint.
  const appCheckToken = req.headers['x-firebase-appcheck'];
  try {
    await verifyAppCheckToken(typeof appCheckToken === 'string' ? appCheckToken : '');
  } catch (error) {
    const details = errorDetails(error);
    console.error('App Check verification failed:', details);
    if (details.code.toLowerCase().includes('permission')) {
      return send(res, 503, {
        error: 'The server service account cannot verify Firebase App Check tokens. Grant it the Firebase App Check Token Verifier role.',
        code: details.code,
      }, origin);
    }
    return send(res, 401, { error: 'Invalid or missing App Check token.', code: details.code }, origin);
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return send(res, 400, { error: 'Invalid JSON request body.' }, origin);
  }

  const requestedUid = String(body.uid || '').trim();
  if (!requestedUid) return send(res, 400, { error: 'A user UID is required.' }, origin);

  try {
    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    const decodedToken = await auth.verifyIdToken(idToken, true);
    const adminUid = decodedToken.uid;

    const adminSnapshot = await db.collection('admins').doc(adminUid).get();
    const adminData = adminSnapshot.exists ? adminSnapshot.data() : null;
    if (adminData?.role !== 'admin' || adminData?.active !== true) {
      return send(res, 403, { error: 'Administrator authorization required.' }, origin);
    }

    if (requestedUid === adminUid) {
      return send(res, 400, { error: 'The current administrator cannot delete their own account.' }, origin);
    }

    const targetAdminSnapshot = await db.collection('admins').doc(requestedUid).get();
    const targetAdminData = targetAdminSnapshot.exists ? targetAdminSnapshot.data() : null;
    if (targetAdminData?.role === 'admin') {
      return send(res, 403, { error: 'Admin accounts are protected from deletion.' }, origin);
    }

    // Official Firebase Admin SDK deletion flow.
    await auth.deleteUser(requestedUid);

    try {
      await db.collection('users').doc(requestedUid).delete();
    } catch (error) {
      if (error?.code !== 5 && error?.code !== 'not-found') throw error;
    }

    return send(res, 200, { success: true }, origin);
  } catch (error) {
    const details = errorDetails(error);
    console.error('Admin user deletion failed:', details);

    if (details.code === 'auth/user-not-found') {
      return send(res, 404, { error: 'That Firebase Authentication user no longer exists.', code: details.code }, origin);
    }
    if (details.code === 'auth/id-token-revoked' || details.code === 'auth/user-disabled') {
      return send(res, 401, { error: 'Your administrator session is no longer valid. Please sign in again.', code: details.code }, origin);
    }
    if (details.code === 'auth/insufficient-permission') {
      return send(res, 503, {
        error: 'The Vercel Firebase service account does not have permission to delete Authentication users. Grant the Firebase Authentication Admin role to that service account, then redeploy.',
        code: details.code,
      }, origin);
    }
    if (details.code === 'auth/invalid-credential' || details.code === 'auth/project-not-found') {
      return send(res, 503, {
        error: 'The Vercel Firebase service-account credentials or project configuration are invalid. Check FIREBASE_SERVICE_ACCOUNT_JSON and redeploy.',
        code: details.code,
      }, origin);
    }
    return send(res, 500, { error: details.message, code: details.code }, origin);
  }
}
