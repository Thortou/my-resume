import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CreateNotificationInput {
  userId?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export const notificationRepository = {
  // Create notification
  async create(data: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: (data.data as Prisma.InputJsonValue) || undefined,
      },
    });
  },

  // Find all notifications with filters
  async findAll(options?: {
    page?: number;
    limit?: number;
    userId?: string | null;
    type?: string;
    isRead?: boolean;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};

    // Handle userId filter - null means admin notifications
    if (options?.userId !== undefined) {
      where.userId = options.userId;
    }

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.isRead !== undefined) {
      where.isRead = options.isRead;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Find notification by ID
  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  },

  // Count unread notifications
  async countUnread(userId?: string) {
    const where: Prisma.NotificationWhereInput = {
      isRead: false,
    };

    if (userId) {
      where.userId = userId;
    } else {
      where.userId = null; // Admin notifications
    }

    return prisma.notification.count({ where });
  },

  // Mark as read
  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },

  // Mark all as read
  async markAllAsRead(userId?: string) {
    const where: Prisma.NotificationWhereInput = {
      isRead: false,
    };

    if (userId) {
      where.userId = userId;
    } else {
      where.userId = null;
    }

    return prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });
  },

  // Delete notification
  async delete(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  },

  // Delete old notifications
  async deleteOlderThan(date: Date) {
    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: date },
        isRead: true,
      },
    });
  },

  // Get recent notifications
  async findRecent(userId?: string, limit: number = 5) {
    const where: Prisma.NotificationWhereInput = {};

    if (userId) {
      where.userId = userId;
    } else {
      where.userId = null;
    }

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};
