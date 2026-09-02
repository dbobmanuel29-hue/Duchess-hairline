import { auth } from './firebase';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Cloudinary uploads are now signed server-side. The browser only needs the
// public cloud name; the API key/secret stay on Vercel.
export const cloudinaryConfigured = Boolean(cloudName);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_FOLDERS = new Set([
  'duchess-hairline/products',
  'duchess-hairline/profiles',
  'duchess-hairline/testimonials',
]);

export async function uploadToCloudinary(
  file: File,
  folder = 'duchess-hairline/products',
): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Image upload is not configured.');
  }
  if (!auth?.currentUser) {
    throw new Error('Please sign in as an administrator before uploading images.');
  }
  if (!file) throw new Error('Please choose a file first.');
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Please choose a JPG, PNG, WEBP, or GIF image.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image is too large. Please choose an image under 10 MB.');
  }

  const safeFolder = ALLOWED_FOLDERS.has(folder) ? folder : 'duchess-hairline/products';
  const idToken = await auth.currentUser.getIdToken();

  const signatureResponse = await fetch('/api/admin/cloudinary-signature', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folder: safeFolder }),
  });

  let signatureData: any = null;
  try { signatureData = await signatureResponse.json(); } catch { /* handled below */ }
  if (!signatureResponse.ok || !signatureData?.signature) {
    throw new Error(signatureData?.error || 'Unable to prepare the image upload.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('api_key', signatureData.apiKey);
  body.append('timestamp', String(signatureData.timestamp));
  body.append('folder', signatureData.folder);
  body.append('signature', signatureData.signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  let data: any = null;
  try { data = await response.json(); } catch { /* handled below */ }
  if (!response.ok || !data?.secure_url) {
    throw new Error('Image upload failed. Please try again.');
  }
  return data.secure_url as string;
}
