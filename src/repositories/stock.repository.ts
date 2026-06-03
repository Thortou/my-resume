import prisma from '@/lib/prisma';
import type { Prisma, StockMovementType } from '@prisma/client';

export interface CreateStockLogInput {
  productId: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference?: string;
  notes?: string;
  createdBy?: string;
}

export const stockRepository = {
  // Create stock log
  async create(data: CreateStockLogInput) {
    return prisma.stockLog.create({
      data: {
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        previousStock: data.previousStock,
        newStock: data.newStock,
        reference: data.reference,
        notes: data.notes,
        createdBy: data.createdBy,
      },
    });
  },

  // Find stock logs by product
  async findByProduct(
    productId: string,
    options?: { page?: number; limit?: number }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.stockLog.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.stockLog.count({ where: { productId } }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find all stock logs with filters
  async findAll(options?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: StockMovementType;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.StockLogWhereInput = {};

    if (options?.productId) {
      where.productId = options.productId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options?.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options?.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      prisma.stockLog.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              thumbnail: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.stockLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get stock log by ID
  async findById(id: string) {
    return prisma.stockLog.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  },

  // Get movement summary (for reports)
  async getMovementSummary(startDate?: Date, endDate?: Date) {
    const where: Prisma.StockLogWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [inCount, outCount, adjustmentCount, totalIn, totalOut] =
      await Promise.all([
        prisma.stockLog.count({ where: { ...where, type: 'IN' } }),
        prisma.stockLog.count({ where: { ...where, type: 'OUT' } }),
        prisma.stockLog.count({ where: { ...where, type: 'ADJUSTMENT' } }),
        prisma.stockLog.aggregate({
          where: { ...where, type: 'IN' },
          _sum: { quantity: true },
        }),
        prisma.stockLog.aggregate({
          where: { ...where, type: 'OUT' },
          _sum: { quantity: true },
        }),
      ]);

    return {
      movements: {
        in: inCount,
        out: outCount,
        adjustment: adjustmentCount,
      },
      quantities: {
        totalIn: totalIn._sum.quantity || 0,
        totalOut: totalOut._sum.quantity || 0,
      },
    };
  },

  // Get recent stock movements
  async findRecent(limit: number = 10) {
    return prisma.stockLog.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Delete old logs (for cleanup)
  async deleteOlderThan(date: Date) {
    return prisma.stockLog.deleteMany({
      where: {
        createdAt: { lt: date },
      },
    });
  },
};
