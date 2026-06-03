'use server';

import { auth } from '@/lib/auth';
import { notificationService } from '@/services/notification.service';
import type { ActionState } from '@/types';

// Get admin notifications
export async function getAdminNotificationsAction(options?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  return notificationService.getAdminNotifications(options);
}

// Get user notifications
export async function getUserNotificationsAction(options?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  const session = await auth();

  if (!session?.user) {
    return {
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    };
  }

  return notificationService.getUserNotifications(session.user.id, options);
}

// Get admin unread count
export async function getAdminUnreadCountAction() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    return 0;
  }

  return notificationService.getAdminUnreadCount();
}

// Get user unread count
export async function getUserUnreadCountAction() {
  const session = await auth();

  if (!session?.user) {
    return 0;
  }

  return notificationService.getUserUnreadCount(session.user.id);
}

// Mark notification as read
export async function markNotificationAsReadAction(
  id: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບ',
    };
  }

  return notificationService.markAsRead(id);
}

// Mark all notifications as read
export async function markAllNotificationsAsReadAction(): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບ',
    };
  }

  // Admin marks admin notifications, users mark their own
  const userId = session.user.role === 'ADMIN' ? undefined : session.user.id;
  return notificationService.markAllAsRead(userId);
}

// Delete notification
export async function deleteNotificationAction(
  id: string
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: 'ທ່ານຕ້ອງເຂົ້າສູ່ລະບົບ',
    };
  }

  return notificationService.delete(id);
}
