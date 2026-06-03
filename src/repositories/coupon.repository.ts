import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CouponFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const couponRepository = {
  // Find all coupons with pagination
  async findAll(options?: CouponFilterOptions) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CouponWhereInput = {};

    if (options?.search) {
      where.OR = [
        { code: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: {
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find coupon by ID
  async findById(id: string) {
    return prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  },

  // Find coupon by code
  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  },

  // Check if code exists
  async codeExists(code: string, excludeId?: string) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!coupon;
  },

  // Create coupon
  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({ data });
  },

  // Update coupon
  async update(id: string, data: Prisma.CouponUpdateInput) {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  },

  // Delete coupon
  async delete(id: string) {
    return prisma.coupon.delete({
      where: { id },
    });
  },

  // Increment usage count
  async incrementUsage(id: string) {
    return prisma.coupon.update({
      where: { id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  },

  // Get valid coupons (active, not expired, not exceeded usage)
  async findValid() {
    const now = new Date();

    return prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
          {
            OR: [
              { usageLimit: null },
              {
                usageLimit: {
                  gt: prisma.coupon.fields.usedCount,
                },
              },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get coupon count
  async count(where?: Prisma.CouponWhereInput) {
    return prisma.coupon.count({ where });
  },
};
