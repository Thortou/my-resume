import prisma from '@/lib/prisma';
import type { PaymentStatus, Prisma } from '@prisma/client';

export const paymentRepository = {
  // Create a new payment
  async create(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({ data });
  },

  // Find payment by ID
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: { user: true },
    });
  },

  // Find payment by transaction ID
  async findByTransactionId(transactionId: string) {
    return prisma.payment.findUnique({
      where: { transactionId },
    });
  },

  // Find payments by user ID
  async findByUserId(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Check if user has active payment for a product
  async hasActivePayment(
    userId: string,
    productType: string,
    productId?: string
  ) {
    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        productType,
        productId: productId || undefined,
        status: 'COMPLETED',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    return !!payment;
  },

  // Find completed payments for a product type
  async findCompletedByProductType(userId: string, productType: string) {
    return prisma.payment.findMany({
      where: {
        userId,
        productType,
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Update payment status
  async updateStatus(id: string, status: PaymentStatus) {
    return prisma.payment.update({
      where: { id },
      data: { status },
    });
  },

  // Get all payments (for admin)
  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = options?.status
      ? { status: options.status }
      : {};

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
