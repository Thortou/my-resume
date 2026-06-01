import { v2 as cloudinary } from 'cloudinary';
import type { CloudinaryFolder } from '@/constants';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Re-export folder constants for server-side usage
export { CLOUDINARY_FOLDERS as CloudinaryFolders } from '@/constants';
export type { CloudinaryFolder } from '@/constants';

// Upload options interface
export interface UploadOptions {
  folder: CloudinaryFolder;
  publicId?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
}

// Upload result interface
export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
}

// Upload image from base64 or URL
export async function uploadImage(
  file: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    const uploadOptions: Record<string, unknown> = {
      folder: options.folder,
      resource_type: 'image',
      overwrite: true,
    };

    if (options.publicId) {
      uploadOptions.public_id = options.publicId;
    }

    if (options.transformation) {
      uploadOptions.transformation = [
        {
          width: options.transformation.width,
          height: options.transformation.height,
          crop: options.transformation.crop || 'fill',
          quality: options.transformation.quality || 'auto',
        },
      ];
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

// Delete image by public ID
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

// Delete multiple images
export async function deleteImages(publicIds: string[]): Promise<boolean> {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return Object.keys(result.deleted).length === publicIds.length;
  } catch (error) {
    console.error('Cloudinary bulk delete error:', error);
    throw new Error('Failed to delete images from Cloudinary');
  }
}

// Generate optimized image URL
export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
  }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: 'fill',
        quality: options?.quality || 'auto',
        format: options?.format || 'auto',
      },
    ],
  });
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
