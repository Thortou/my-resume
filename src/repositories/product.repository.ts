import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface ProductFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  sortBy?: 'name' | 'price' | 'createdAt' | 'stockQuantity';
  sortOrder?: 'asc' | 'desc';
}

export const productRepository = {
  // Find all products with pagination and filters
  async findAll(options?: ProductFilterOptions) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';

    const where: Prisma.ProductWhereInput = {};

    // Search filter
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { sku: { contains: options.search, mode: 'insensitive' } },
        { barcode: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    // Active status filter
    if (options?.isActive !== undefined) {
      where.isActive = options.isActive;
    }

    // Featured filter
    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    // Price range filter
    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.price = {};
      if (options?.minPrice !== undefined) {
        where.price.gte = options.minPrice;
      }
      if (options?.maxPrice !== undefined) {
        where.price.lte = options.maxPrice;
      }
    }

    // Stock status filter
    if (options?.stockStatus) {
      switch (options.stockStatus) {
        case 'IN_STOCK':
          where.AND = [
            { stockQuantity: { gt: 0 } },
            {
              OR: [
                { minStockLevel: { equals: 0 } },
                { stockQuantity: { gt: prisma.product.fields.minStockLevel } },
              ],
            },
          ];
          // Simplified: just check > minStockLevel
          where.stockQuantity = { gt: 0 };
          break;
        case 'LOW_STOCK':
          where.AND = [
            { stockQuantity: { gt: 0 } },
            // Will be handled in raw query or simplified
          ];
          break;
        case 'OUT_OF_STOCK':
          where.stockQuantity = { equals: 0 };
          break;
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          _count: {
            select: {
              orderItems: true,
              reviews: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find all active products for shop
  async findAllActive(options?: {
    categoryId?: string;
    search?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (options?.categoryId) {
      where.categoryId = options.categoryId;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
          },
        },
        orderBy: options?.sortBy
          ? { [options.sortBy]: options.sortOrder || 'desc' }
          : { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find featured products
  async findFeatured(limit: number = 8) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Find product by ID
  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
          },
        },
      },
    });
  },

  // Find product by slug
  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  // Find product by SKU
  async findBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  },

  // Check if slug exists
  async slugExists(slug: string, excludeId?: string) {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!product;
  },

  // Check if SKU exists
  async skuExists(sku: string, excludeId?: string) {
    const product = await prisma.product.findFirst({
      where: {
        sku,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!product;
  },

  // Create product
  async create(data: Prisma.ProductCreateInput, images?: string[]) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data });

      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((url, index) => ({
            productId: product.id,
            url,
            sortOrder: index,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });
  },

  // Update product
  async update(id: string, data: Prisma.ProductUpdateInput, images?: string[]) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data,
      });

      // If images are provided, replace all existing images
      if (images !== undefined) {
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((url, index) => ({
              productId: id,
              url,
              sortOrder: index,
            })),
          });
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });
  },

  // Delete product
  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },

  // Update stock quantity
  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
    });
  },

  // Increment stock
  async incrementStock(id: string, amount: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity: {
          increment: amount,
        },
      },
    });
  },

  // Decrement stock
  async decrementStock(id: string, amount: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity: {
          decrement: amount,
        },
      },
    });
  },

  // Get product count
  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({ where });
  },

  // Get low stock products
  async findLowStock(limit: number = 10) {
    return prisma.$queryRaw`
      SELECT p.*, c.name as "categoryName"
      FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p."stockQuantity" <= p."minStockLevel"
      AND p."stockQuantity" > 0
      AND p."isActive" = true
      ORDER BY p."stockQuantity" ASC
      LIMIT ${limit}
    `;
  },

  // Get out of stock products
  async findOutOfStock(limit: number = 10) {
    return prisma.product.findMany({
      where: {
        stockQuantity: { equals: 0 },
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  },

  // Get best selling products
  async findBestSelling(limit: number = 10) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return products;
  },

  // Get products by category
  async findByCategory(categoryId: string, limit?: number) {
    return prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get related products
  async findRelated(productId: string, categoryId: string, limit: number = 4) {
    return prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get product statistics
  async getStats() {
    const [total, active, featured, outOfStock, lowStockRaw] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { isFeatured: true, isActive: true } }),
        prisma.product.count({ where: { stockQuantity: 0 } }),
        prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count
        FROM products
        WHERE "stockQuantity" <= "minStockLevel"
        AND "stockQuantity" > 0
        AND "isActive" = true
      `,
      ]);

    const lowStock = Number(lowStockRaw[0]?.count || 0);

    return {
      total,
      active,
      featured,
      outOfStock,
      lowStock,
    };
  },
};
