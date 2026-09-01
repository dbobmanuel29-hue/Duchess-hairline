import crypto from 'node:crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'duchess-hairline';
const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY;
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

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  if (!SERVICE_ACCOUNT_JSON) throw new Error('Server-side Firebase credentials are not configured yet.');
  const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID,
  });
}

async function verifyAppCheckToken(token) {
  if (!token) throw new Error('App Check token required.');
  await getAppCheck(getAdminApp()).verifyToken(token);
}

function base64url(value) { return Buffer.from(value).toString('base64url'); }

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error('Could not obtain the server authorization token.');
  return data.access_token;
}

async function lookupCurrentAdmin(idToken) {
  if (!WEB_API_KEY) throw new Error('Firebase Web API key is not configured on the server.');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await response.json();
  if (!response.ok || !data.users?.[0]?.localId) throw new Error('Your Firebase session could not be verified. Please sign in again.');
  return data.users[0].localId;
}

async function getDocument(accessToken, path) {
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/databases/(default)/documents/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 404) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Could not read the Firebase document.');
  return data;
}

async function deleteDocument(accessToken, path) {
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/databases/(default)/documents/${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok && response.status !== 404) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || 'Could not delete the Firestore profile.');
  }
}

async function deleteAuthUser(accessToken, uid) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/accounts:delete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ localId: uid }),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.message || 'Could not delete the Firebase Authentication account.');
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (req.method === 'OPTIONS') {
    setHeaders(res, origin);
    return res.status(204).end();
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed.' }, origin);
  if (!SERVICE_ACCOUNT_JSON) return send(res, 503, { error: 'Server-side Firebase credentials are not configured yet.' }, origin);

  const authorization = req.headers.authorization || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!idToken) return send(res, 401, { error: 'Authentication required.' }, origin);

  const appCheckToken = req.headers['x-firebase-appcheck'];
  try {
    await verifyAppCheckToken(typeof appCheckToken === 'string' ? appCheckToken : '');
  } catch (error) {
    console.error('App Check verification failed:', error);
    return send(res, 401, { error: 'Invalid or missing App Check token.' }, origin);
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
    const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
    const accessToken = await getAccessToken(serviceAccount);
    const adminUid = await lookupCurrentAdmin(idToken);
    const adminDoc = await getDocument(accessToken, `admins/${encodeURIComponent(adminUid)}`);
    if (adminDoc?.fields?.role?.stringValue !== 'admin' || adminDoc.fields?.active?.booleanValue !== true) {
      return send(res, 403, { error: 'Administrator authorization required.' }, origin);
    }
    if (requestedUid === adminUid) {
      return send(res, 400, { error: 'The current administrator cannot delete their own account.' }, origin);
    }
    const targetAdminDoc = await getDocument(accessToken, `admins/${encodeURIComponent(requestedUid)}`);
    if (targetAdminDoc?.fields?.role?.stringValue === 'admin') {
      return send(res, 403, { error: 'Admin accounts are protected from deletion.' }, origin);
    }
    await deleteAuthUser(accessToken, requestedUid);
    await deleteDocument(accessToken, `users/${encodeURIComponent(requestedUid)}`);
    return send(res, 200, { success: true }, origin);
  } catch (error) {
    console.error('Admin user deletion failed:', error);
    return send(res, 500, { error: error instanceof Error ? error.message : 'User deletion failed.' }, origin);
  }
}
