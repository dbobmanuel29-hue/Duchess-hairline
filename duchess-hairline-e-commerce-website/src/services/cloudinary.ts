const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

export async function uploadToCloudinary(
  file: File,
  folder = 'duchess-hairline/products',
): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in Vercel.');
  }
  if (!file) throw new Error('Please choose a file first.');
  if (file.size > 15 * 1024 * 1024) throw new Error('File is too large. Please choose an image or video under 15 MB.');
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Please choose an image or video file.');
  }

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);
  body.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
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
