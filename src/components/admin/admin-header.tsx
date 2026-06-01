'use client';

import { useRouter } from 'next/navigation';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { logoutAction } from '@/actions';
import { getInitials } from '@/lib/utils';
import { ROUTES } from '@/constants';

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminHeader({ collapsed, onToggle }: AdminHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await logoutAction();
    router.push(ROUTES.LOGIN);
    router.refresh();
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'ໂປຣໄຟລ໌',
      onClick: () => router.push(ROUTES.ADMIN_SETTINGS),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ອອກຈາກລະບົບ',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 shadow-sm"
      style={{ padding: '0 24px' }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className="h-10 w-10"
      />

      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <Space className="cursor-pointer">
          <Avatar
            icon={<UserOutlined />}
            src={session?.user?.image}
            className="bg-primary-500"
          >
            {session?.user?.name
              ? getInitials(session.user.name)
              : session?.user?.email?.[0].toUpperCase()}
          </Avatar>
          <div className="hidden sm:block">
            <Text strong className="block text-sm">
              {session?.user?.name || 'ຜູ້ໃຊ້'}
            </Text>
            <Text type="secondary" className="block text-xs">
              {session?.user?.email}
            </Text>
          </div>
        </Space>
      </Dropdown>
    </Header>
  );
}
