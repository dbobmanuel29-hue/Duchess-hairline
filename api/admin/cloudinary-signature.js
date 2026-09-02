import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAppCheck } from 'firebase-admin/app-check';
import crypto from 'node:crypto';

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');

  const serviceAccount = JSON.parse(raw);
  return initializeApp({
    credential: cert(serviceAccount),
  });
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const app = getAdminApp();
    const adminAuth = getAuth(app);
    const firestore = getFirestore(app);

    const appCheckToken = req.headers['x-firebase-appcheck'];
    if (process.env.REQUIRE_FIREBASE_APP_CHECK !== 'false') {
      if (!appCheckToken || Array.isArray(appCheckToken)) {
        return sendJson(res, 401, { error: 'App verification required.' });
      }
      await getAppCheck(app).verifyToken(appCheckToken);
    }

    const idToken = getBearerToken(req);
    if (!idToken) return sendJson(res, 401, { error: 'Authentication required.' });

    const decodedToken = await adminAuth.verifyIdToken(idToken, true);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const allowedFolders = new Set([
      'duchess-hairline/products',
      'duchess-hairline/profiles',
      'duchess-hairline/testimonials',
    ]);
    const folder = allowedFolders.has(body.folder) ? body.folder : 'duchess-hairline/products';

    // Profile photos are allowed for any authenticated user.
    // Product and testimonial uploads remain restricted to active admins.
    if (folder !== 'duchess-hairline/profiles') {
      const adminSnap = await firestore.collection('admins').doc(decodedToken.uid).get();
      const adminData = adminSnap.data();

      if (!adminSnap.exists || adminData?.role !== 'admin' || adminData?.active !== true) {
        return sendJson(res, 403, { error: 'Admin access required.' });
      }
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary server configuration is incomplete.');
      return sendJson(res, 500, { error: 'Image upload is not configured.' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    res.setHeader('Cache-Control', 'no-store');
    return sendJson(res, 200, {
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
    });
  } catch (error) {
    console.error('Cloudinary signature request failed:', error);
    return sendJson(res, 500, { error: 'Unable to prepare the image upload.' });
  }
}
