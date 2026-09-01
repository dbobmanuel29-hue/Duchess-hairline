import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const app = firebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;

let appCheck: AppCheck | null = null;

// App Check is initialized immediately after Firebase and before the app uses
// Firebase services. Duchess Hairline uses the reCAPTCHA Enterprise provider.
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;

if (app && appCheckSiteKey) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.warn('Firebase App Check could not be initialized:', error);
    appCheck = null;
  }
}

// Protect requests to Duchess Hairline's own /api endpoints with the current
// App Check token. Firebase recommends sending custom-backend App Check tokens
// in the X-Firebase-AppCheck header rather than in URLs.
//
// The admin deletion endpoint also gets a freshly refreshed Firebase Auth ID
// token immediately before the request. This prevents a cached/stale ID token
// from being rejected by the server while keeping App Check protection intact.
if (appCheck && typeof window !== 'undefined') {
  const fetchKey = '__duchessAppCheckFetchWrapped';
  const windowWithFlag = window as typeof window & { [fetchKey]?: boolean };
  if (!windowWithFlag[fetchKey]) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const requestUrl = new URL(input instanceof Request ? input.url : String(input), window.location.origin);
        if (requestUrl.pathname.startsWith('/api/')) {
          const headers = new Headers(input instanceof Request ? input.headers : undefined);
          if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));

          const tokenResult = await getToken(appCheck!, false);
          if (tokenResult?.token) {
            headers.set('X-Firebase-AppCheck', tokenResult.token);
          }

          if (requestUrl.pathname === '/api/admin/delete-user') {
            const currentUser = auth?.currentUser;
            if (!currentUser) {
              throw new Error('No signed-in Firebase user is available.');
            }
            const idToken = await currentUser.getIdToken(true);
            headers.set('Authorization', `Bearer ${idToken}`);
          }

          return originalFetch(input, { ...init, headers });
        }
      } catch (error) {
        console.warn('Firebase authentication/App Check token could not be attached to API request:', error);
        if (error instanceof Error && error.message === 'No signed-in Firebase user is available.') {
          throw error;
        }
      }
      return originalFetch(input, init);
    };
    windowWithFlag[fetchKey] = true;
  }
}

export { appCheck };
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
