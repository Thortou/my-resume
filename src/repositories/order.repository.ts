import prisma from '@/lib/prisma';
import type { Prisma, OrderStatus } from '@prisma/client';

export interface OrderFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: 'createdAt' | 'total' | 'orderNumber';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderInput {
  userId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  couponId?: string | null;
  couponCode?: string | null;
  notes?: string | null;
  items: {
    productId: string;
    productName: string;
    productSku?: string | null;
    price: number;
    quantity: number;
    total: number;
  }[];
}

export const orderRepository = {
  // Find all orders with filters
  async findAll(options?: OrderFilterOptions) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';

    const where: Prisma.OrderWhereInput = {};

    // Search filter
    if (options?.search) {
      where.OR = [
        { orderNumber: { contains: options.search, mode: 'insensitive' } },
        { customerName: { contains: options.search, mode: 'insensitive' } },
        { customerEmail: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (options?.status) {
      where.status = options.status;
    }

    // User filter
    if (options?.userId) {
      where.userId = options.userId;
    }

    // Date range filter
    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options?.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options?.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnail: true,
                },
              },
            },
          },
          coupon: {
            select: {
              id: true,
              code: true,
              discountType: true,
              discountValue: true,
            },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find order by ID
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                thumbnail: true,
              },
            },
          },
        },
        coupon: true,
      },
    });
  },

  // Find order by order number
  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                thumbnail: true,
              },
            },
          },
        },
        coupon: true,
      },
    });
  },

  // Find orders by user
  async findByUser(
    userId: string,
    options?: { page?: number; limit?: number }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnail: true,
                },
              },
            },
          },
          _count: {
            select: { items: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Create order
  async create(data: CreateOrderInput) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        subtotal: data.subtotal,
        discount: data.discount || 0,
        tax: data.tax || 0,
        total: data.total,
        couponId: data.couponId,
        couponCode: data.couponCode,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  },

  // Update order status
  async updateStatus(id: string, status: OrderStatus, notes?: string) {
    const updateData: Prisma.OrderUpdateInput = { status };

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    if (notes) {
      updateData.notes = notes;
    }

    return prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });
  },

  // Delete order (soft delete or hard delete)
  async delete(id: string) {
    return prisma.order.delete({
      where: { id },
    });
  },

  // Get order count
  async count(where?: Prisma.OrderWhereInput) {
    return prisma.order.count({ where });
  },

  // Get recent orders
  async findRecent(limit: number = 5) {
    return prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get order statistics
  async getStats(startDate?: Date, endDate?: Date) {
    const where: Prisma.OrderWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    const [total, pending, processing, completed, cancelled, revenue] =
      await Promise.all([
        prisma.order.count({ where }),
        prisma.order.count({ where: { ...where, status: 'PENDING' } }),
        prisma.order.count({ where: { ...where, status: 'PROCESSING' } }),
        prisma.order.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.order.count({ where: { ...where, status: 'CANCELLED' } }),
        prisma.order.aggregate({
          where: { ...where, status: 'COMPLETED' },
          _sum: { total: true },
        }),
      ]);

    return {
      total,
      pending,
      processing,
      completed,
      cancelled,
      revenue: Number(revenue._sum.total || 0),
    };
  },

  // Get revenue by period
  async getRevenueByPeriod(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month'
  ) {
    const format =
      groupBy === 'day'
        ? 'YYYY-MM-DD'
        : groupBy === 'week'
          ? 'IYYY-IW'
          : 'YYYY-MM';

    const result = await prisma.$queryRaw<
      { period: string; revenue: number; count: number }[]
    >`
      SELECT
        TO_CHAR("createdAt", ${format}) as period,
        SUM(CAST(total AS DECIMAL)) as revenue,
        COUNT(*)::int as count
      FROM orders
      WHERE "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND status = 'COMPLETED'
      GROUP BY period
      ORDER BY period ASC
    `;

    return result;
  },

  // Generate order number
  async generateOrderNumber() {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const prefix = `ORD${year}${month}${day}`;

    // Get today's order count
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `${prefix}${sequence}`;
  },
};
