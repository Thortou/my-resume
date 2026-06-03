'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Dropdown,
  Empty,
  List,
  Spin,
  Typography,
  message,
} from 'antd';
import {
  BellOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants';
import {
  getAdminNotificationsAction,
  getAdminUnreadCountAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from '@/actions/notification.actions';

const { Text } = Typography;

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: Date;
}

const notificationIcons: Record<string, React.ReactNode> = {
  NEW_ORDER: <ShoppingCartOutlined className="text-blue-500" />,
  LOW_STOCK: <WarningOutlined className="text-yellow-500" />,
  ORDER_COMPLETED: <CheckCircleOutlined className="text-green-500" />,
  ORDER_CANCELLED: <CloseCircleOutlined className="text-red-500" />,
  DEFAULT: <InfoCircleOutlined className="text-gray-500" />,
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    const count = await getAdminUnreadCountAction();
    setUnreadCount(count);
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdminNotificationsAction({ limit: 10 });
      setNotifications(result.data as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsReadAction(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    const result = await markAllNotificationsAsReadAction();
    if (result.success) {
      message.success('ອ່ານການແຈ້ງເຕືອນທັງໝົດແລ້ວ');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  // Get link for notification
  const getNotificationLink = (notification: Notification) => {
    const data = notification.data as { orderId?: string; productId?: string };
    if (notification.type === 'NEW_ORDER' && data?.orderId) {
      return ROUTES.ADMIN_ORDER_DETAIL(data.orderId);
    }
    if (notification.type === 'LOW_STOCK' && data?.productId) {
      return ROUTES.ADMIN_STOCK;
    }
    return null;
  };

  // Format time
  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'ດຽວນີ້';
    if (diffMins < 60) return `${diffMins} ນາທີກ່ອນ`;
    if (diffHours < 24) return `${diffHours} ຊົ່ວໂມງກ່ອນ`;
    if (diffDays < 7) return `${diffDays} ມື້ກ່ອນ`;
    return d.toLocaleDateString('lo-LA');
  };

  const dropdownContent = (
    <div className="max-h-[400px] w-80 overflow-hidden rounded-lg border bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <Text strong>ການແຈ້ງເຕືອນ</Text>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllAsRead}>
            ອ່ານທັງໝົດ
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="ບໍ່ມີການແຈ້ງເຕືອນ"
            className="py-8"
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => {
              const link = getNotificationLink(item);
              const content = (
                <List.Item
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${
                    !item.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    if (!item.isRead) handleMarkAsRead(item.id);
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        {notificationIcons[item.type] ||
                          notificationIcons.DEFAULT}
                      </div>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm ${!item.isRead ? 'font-semibold' : ''}`}
                        >
                          {item.title}
                        </span>
                        {!item.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    }
                    description={
                      <div>
                        <p className="line-clamp-2 text-xs text-gray-500">
                          {item.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatTime(item.createdAt)}
                        </p>
                      </div>
                    }
                  />
                </List.Item>
              );

              if (link) {
                return (
                  <Link href={link} key={item.id}>
                    {content}
                  </Link>
                );
              }

              return <div key={item.id}>{content}</div>;
            }}
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t bg-gray-50 px-4 py-2">
          <Link href={ROUTES.ADMIN_DASHBOARD}>
            <Button type="link" block size="small">
              ເບິ່ງທັງໝົດ
            </Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      popupRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          icon={<BellOutlined className="text-lg" />}
          className="flex h-10 w-10 items-center justify-center"
        />
      </Badge>
    </Dropdown>
  );
}
