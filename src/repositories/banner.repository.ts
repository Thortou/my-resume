import type { Prisma, Banner } from '@prisma/client';
import prisma from '@/lib/prisma';

export interface BannerFindManyParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BannerFindManyResult {
  banners: Banner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const bannerRepository = {
  // Find banner by ID
  async findById(id: string): Promise<Banner | null> {
    return prisma.banner.findUnique({
      where: { id },
    });
  },

  // Find all active banners (for public display)
  async findAllActive(): Promise<Banner[]> {
    return prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  // Find many banners with pagination and filters
  async findMany(params: BannerFindManyParams): Promise<BannerFindManyResult> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.BannerWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.banner.count({ where }),
    ]);

    return {
      banners,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // Create banner
  async create(data: Prisma.BannerCreateInput): Promise<Banner> {
    return prisma.banner.create({ data });
  },

  // Update banner
  async update(id: string, data: Prisma.BannerUpdateInput): Promise<Banner> {
    return prisma.banner.update({
      where: { id },
      data,
    });
  },

  // Delete banner
  async delete(id: string): Promise<Banner> {
    return prisma.banner.delete({
      where: { id },
    });
  },

  // Get max sort order
  async getMaxSortOrder(): Promise<number> {
    const result = await prisma.banner.aggregate({
      _max: { sortOrder: true },
    });
    return result._max.sortOrder ?? 0;
  },

  // Count banners
  async count(): Promise<number> {
    return prisma.banner.count();
  },

  // Count active banners
  async countActive(): Promise<number> {
    return prisma.banner.count({ where: { isActive: true } });
  },
};
