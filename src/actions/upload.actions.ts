'use server';

import {
  uploadImage,
  deleteImage,
  CloudinaryFolders,
  type CloudinaryFolder,
} from '@/lib/cloudinary';
import type { ActionState, UploadedFile } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { UPLOAD } from '@/constants';

// Validate file type
function isValidImageType(base64: string): boolean {
  const mimeMatch = base64.match(/^data:(image\/\w+);base64,/);
  if (!mimeMatch) return false;

  const mimeType = mimeMatch[1];
  return (UPLOAD.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(mimeType);
}

// Get file size from base64
function getBase64FileSize(base64: string): number {
  const base64Data = base64.split(',')[1] || base64;
  return Math.ceil((base64Data.length * 3) / 4);
}

// Upload image action
export async function uploadImageAction(
  base64: string,
  folder: CloudinaryFolder = CloudinaryFolders.USERS
): Promise<ActionState<UploadedFile>> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  // Validate file type
  if (!isValidImageType(base64)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  // Validate file size
  const fileSize = getBase64FileSize(base64);
  if (fileSize > UPLOAD.MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds ${UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    };
  }

  try {
    const result = await uploadImage(base64, {
      folder,
      transformation: {
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto',
      },
    });

    return {
      success: true,
      data: {
        publicId: result.publicId,
        url: result.url,
        secureUrl: result.secureUrl,
        width: result.width,
        height: result.height,
        format: result.format,
      },
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image',
    };
  }
}

// Delete image action
export async function deleteImageAction(
  publicId: string
): Promise<ActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      error: 'Unauthorized',
    };
  }

  if (currentUser.role !== 'ADMIN') {
    return {
      success: false,
      error: 'Access denied',
    };
  }

  try {
    await deleteImage(publicId);

    return {
      success: true,
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'Failed to delete image',
    };
  }
}
