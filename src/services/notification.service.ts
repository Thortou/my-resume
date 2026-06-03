import { notificationRepository } from '@/repositories/notification.repository';
import type { ActionState } from '@/types';

export type NotificationType =
  | 'low_stock'
  | 'out_of_stock'
  | 'new_order'
  | 'order_completed'
  | 'order_cancelled'
  | 'system';

export interface CreateNotificationInput {
  userId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export const notificationService = {
  // Create notification
  async create(input: CreateNotificationInput) {
    return notificationRepository.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: input.data,
    });
  },

  // Create low stock notification
  async createLowStockNotification(
    productId: string,
    productName: string,
    currentStock: number
  ) {
    return this.create({
      type: 'low_stock',
      title: 'ສິນຄ້າໃກ້ໝົດ',
      message: `ສິນຄ້າ "${productName}" ເຫຼືອພຽງ ${currentStock} ໜ່ວຍ`,
      data: { productId, productName, currentStock },
    });
  },

  // Create out of stock notification
  async createOutOfStockNotification(productId: string, productName: string) {
    return this.create({
      type: 'out_of_stock',
      title: 'ສິນຄ້າໝົດ',
      message: `ສິນຄ້າ "${productName}" ໝົດແລ້ວ`,
      data: { productId, productName },
    });
  },

  // Create new order notification
  async createNewOrderNotification(
    orderId: string,
    orderNumber: string,
    total: number
  ) {
    return this.create({
      type: 'new_order',
      title: 'ຄຳສັ່ງຊື້ໃໝ່',
      message: `ມີຄຳສັ່ງຊື້ໃໝ່ #${orderNumber} ມູນຄ່າ ${total.toLocaleString()} ກີບ`,
      data: { orderId, orderNumber, total },
    });
  },

  // Create order completed notification
  async createOrderCompletedNotification(
    orderId: string,
    orderNumber: string,
    userId: string
  ) {
    return this.create({
      userId,
      type: 'order_completed',
      title: 'ຄຳສັ່ງຊື້ສຳເລັດ',
      message: `ຄຳສັ່ງຊື້ #${orderNumber} ຂອງທ່ານໄດ້ສຳເລັດແລ້ວ`,
      data: { orderId, orderNumber },
    });
  },

  // Create order cancelled notification
  async createOrderCancelledNotification(
    orderId: string,
    orderNumber: string,
    userId: string
  ) {
    return this.create({
      userId,
      type: 'order_cancelled',
      title: 'ຄຳສັ່ງຊື້ຖືກຍົກເລີກ',
      message: `ຄຳສັ່ງຊື້ #${orderNumber} ໄດ້ຖືກຍົກເລີກ`,
      data: { orderId, orderNumber },
    });
  },

  // Get notifications for admin (no userId)
  async getAdminNotifications(options?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }) {
    return notificationRepository.findAll({
      ...options,
      userId: null, // Admin notifications have no userId
    });
  },

  // Get notifications for user
  async getUserNotifications(
    userId: string,
    options?: { page?: number; limit?: number; isRead?: boolean }
  ) {
    return notificationRepository.findAll({
      ...options,
      userId,
    });
  },

  // Get unread count for admin
  async getAdminUnreadCount() {
    return notificationRepository.countUnread();
  },

  // Get unread count for user
  async getUserUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  },

  // Mark as read
  async markAsRead(id: string): Promise<ActionState> {
    try {
      await notificationRepository.markAsRead(id);
      return {
        success: true,
        message: 'ອ່ານແຈ້ງເຕືອນແລ້ວ',
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອ່ານແຈ້ງເຕືອນໄດ້',
      };
    }
  },

  // Mark all as read
  async markAllAsRead(userId?: string): Promise<ActionState> {
    try {
      await notificationRepository.markAllAsRead(userId);
      return {
        success: true,
        message: 'ອ່ານແຈ້ງເຕືອນທັງໝົດແລ້ວ',
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດອ່ານແຈ້ງເຕືອນໄດ້',
      };
    }
  },

  // Delete notification
  async delete(id: string): Promise<ActionState> {
    try {
      await notificationRepository.delete(id);
      return {
        success: true,
        message: 'ລຶບແຈ້ງເຕືອນແລ້ວ',
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບແຈ້ງເຕືອນໄດ້',
      };
    }
  },

  // Delete old notifications
  async deleteOld(daysOld: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);
    return notificationRepository.deleteOlderThan(date);
  },
};
