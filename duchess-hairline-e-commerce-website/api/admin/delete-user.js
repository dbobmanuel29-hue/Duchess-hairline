import crypto from 'node:crypto';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'duchess-hairline';
const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY;
const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

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

async function lookupTarget(accessToken, identifier) {
  const isEmail = identifier.includes('@');
  const body = isEmail ? { email: [identifier] } : { phoneNumber: [identifier] };
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${encodeURIComponent(PROJECT_ID)}/accounts:lookup`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok || !data.users?.[0]?.localId) throw new Error('The Firebase Authentication account could not be found.');
  return data.users[0].localId;
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

export default async function handler(request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!SERVICE_ACCOUNT_JSON) return json({ error: 'Server-side Firebase credentials are not configured yet.' }, 503);

  const authorization = request.headers.get('authorization') || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!idToken) return json({ error: 'Authentication required.' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request body.' }, 400); }
  const requestedUid = String(body?.uid || '').trim();
  const identifier = String(body?.email || body?.phone || '').trim();
  if (!requestedUid && !identifier) return json({ error: 'A user UID, email, or phone number is required.' }, 400);

  try {
    const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
    const accessToken = await getAccessToken(serviceAccount);
    const adminUid = await lookupCurrentAdmin(idToken);
    const adminDoc = await getDocument(accessToken, `admins/${encodeURIComponent(adminUid)}`);
    if (adminDoc?.fields?.role?.stringValue !== 'admin' || adminDoc.fields?.active?.booleanValue !== true) {
      return json({ error: 'Administrator authorization required.' }, 403);
    }

    const targetUid = requestedUid || await lookupTarget(accessToken, identifier);
    if (targetUid === adminUid) return json({ error: 'The current administrator cannot delete their own account.' }, 400);

    const targetAdminDoc = await getDocument(accessToken, `admins/${encodeURIComponent(targetUid)}`);
    if (targetAdminDoc?.fields?.role?.stringValue === 'admin') {
      return json({ error: 'Admin accounts are protected from deletion.' }, 403);
    }

    await deleteAuthUser(accessToken, targetUid);
    await deleteDocument(accessToken, `users/${encodeURIComponent(targetUid)}`);
    return json({ success: true });
  } catch (error) {
    console.error('Admin user deletion failed:', error);
    return json({ error: error instanceof Error ? error.message : 'User deletion failed.' }, 500);
  }
}
