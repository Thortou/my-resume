import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage, CloudinaryFolders } from '@/lib/cloudinary';
import { UPLOAD } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || CloudinaryFolders.USERS;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!(UPLOAD.ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > UPLOAD.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds ${UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, {
      folder: folder as typeof CloudinaryFolders.USERS,
      transformation: {
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        publicId: result.publicId,
        url: result.url,
        secureUrl: result.secureUrl,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
