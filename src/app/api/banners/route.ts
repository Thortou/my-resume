import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { bannerService } from '@/services';
import { bannerListQuerySchema, createBannerSchema } from '@/schemas';

// GET /api/banners - List banners (public: active only, admin: all)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);

    // Public access - return only active banners
    if (!session?.user || session.user.role !== 'ADMIN') {
      const result = await bannerService.getAllActive();
      return NextResponse.json(result);
    }

    // Admin access - return all banners with pagination
    const queryResult = bannerListQuerySchema.safeParse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      isActive: searchParams.get('isActive'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          errors: queryResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await bannerService.getAll(queryResult.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create banner (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = createBannerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = {
      ...validationResult.data,
      description: validationResult.data.description ?? undefined,
      link: validationResult.data.link ?? undefined,
    };

    const result = await bannerService.create(data);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}
