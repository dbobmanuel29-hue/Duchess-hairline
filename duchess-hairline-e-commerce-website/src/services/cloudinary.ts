const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

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
    throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in Vercel.');
  }
  if (!file) throw new Error('Please choose a file first.');
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Please choose a JPG, PNG, WEBP, or GIF image.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image is too large. Please choose an image under 10 MB.');
  }
  const safeFolder = ALLOWED_FOLDERS.has(folder) ? folder : 'duchess-hairline/products';

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);
  body.append('folder', safeFolder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  });

  let data: any = null;
  try { data = await response.json(); } catch { /* handled below */ }
  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed. Check the upload preset and Cloudinary environment variables.');
  }
  return data.secure_url as string;
}
