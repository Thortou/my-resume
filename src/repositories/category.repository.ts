import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const categoryRepository = {
  // Find all categories with pagination
  async findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
      }),
      prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find all active categories (for dropdowns/public)
  async findAllActive() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  // Find category by ID
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },

  // Find category by slug
  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          take: 20,
        },
      },
    });
  },

  // Check if slug exists
  async slugExists(slug: string, excludeId?: string) {
    const category = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!category;
  },

  // Create category
  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },

  // Update category
  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  // Delete category
  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  },

  // Get category count
  async count(where?: Prisma.CategoryWhereInput) {
    return prisma.category.count({ where });
  },
};
