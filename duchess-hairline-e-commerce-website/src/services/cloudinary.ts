const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryConfigured = Boolean(cloudName && uploadPreset);

export async function uploadToCloudinary(file: File, folder = 'duchess-hairline/products'): Promise<string> {
  if (!cloudinaryConfigured) throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);
  body.append('folder', folder);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body });
  if (!response.ok) throw new Error('Cloudinary upload failed.');
  const data = await response.json();
  return data.secure_url as string;
}
