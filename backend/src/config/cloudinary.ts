import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Detects whether a Cloudinary file_url is an image or raw resource.
 * multer-storage-cloudinary stores `secure_url` which contains the resource type in the path.
 */
export const detectResourceType = (fileUrl: string): string => {
  if (fileUrl.includes('/raw/upload/')) return 'raw';
  if (fileUrl.includes('/image/upload/')) return 'image';
  // Default to raw for safety (PDFs uploaded with resource_type: 'auto' may end up as image)
  return 'raw';
};

/**
 * Gets a direct Cloudinary URL for downloading a file (forces browser download).
 * Works for publicly uploaded resources (type: 'upload').
 */
export const getDownloadUrl = (publicId: string, fileUrl: string): string => {
  const resourceType = detectResourceType(fileUrl);

  // Extract version if present (e.g. /v12345/)
  const versionMatch = fileUrl.match(/\/v(\d+)\//);
  const version = versionMatch ? versionMatch[1] : undefined;

  // Extract format if present (e.g. .pdf at the end)
  // Some URLs might have query params, so we handle that
  const cleanUrl = fileUrl.split('?')[0];
  const formatMatch = cleanUrl.match(/\.([^./?#]+)$/);
  const format = formatMatch ? formatMatch[1] : undefined;

  const options: any = {
    resource_type: resourceType,
    secure: true,
    sign_url: true,
    flags: 'attachment',
  };

  if (version) options.version = version;

  // For raw resources, Cloudinary appends the format if specified.
  // We must avoid adding it if the publicId already includes the extension.
  if (format) {
    const isRawEndingWithFormat =
      resourceType === 'raw' &&
      publicId.toLowerCase().endsWith(`.${format.toLowerCase()}`);

    if (!isRawEndingWithFormat) {
      options.format = format;
    }
  }

  return cloudinary.url(publicId, options);
};

/**
 * Gets a direct Cloudinary URL for viewing a file inline (no forced download).
 */
export const getViewableUrl = (publicId: string, fileUrl: string): string => {
  const resourceType = detectResourceType(fileUrl);

  // Same logic as getDownloadUrl for consistency
  const versionMatch = fileUrl.match(/\/v(\d+)\//);
  const version = versionMatch ? versionMatch[1] : undefined;

  const cleanUrl = fileUrl.split('?')[0];
  const formatMatch = cleanUrl.match(/\.([^./?#]+)$/);
  const format = formatMatch ? formatMatch[1] : undefined;

  const options: any = {
    resource_type: resourceType,
    secure: true,
    sign_url: true,
  };

  if (version) options.version = version;
  if (format) options.format = format;

  return cloudinary.url(publicId, options);
};

export default cloudinary;
