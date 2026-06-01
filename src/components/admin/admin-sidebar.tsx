'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  PictureOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { APP_NAME, ROUTES } from '@/constants';

const { Sider } = Layout;

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: ROUTES.ADMIN_DASHBOARD,
    icon: <DashboardOutlined />,
    label: <Link href={ROUTES.ADMIN_DASHBOARD}>ແຜງຄວບຄຸມ</Link>,
  },
  {
    key: ROUTES.ADMIN_USERS,
    icon: <UserOutlined />,
    label: <Link href={ROUTES.ADMIN_USERS}>ຜູ້ໃຊ້</Link>,
  },
  {
    key: ROUTES.ADMIN_BANNERS,
    icon: <PictureOutlined />,
    label: <Link href={ROUTES.ADMIN_BANNERS}>ປ້າຍໂຄສະນາ</Link>,
  },
  {
    key: ROUTES.ADMIN_SETTINGS,
    icon: <SettingOutlined />,
    label: <Link href={ROUTES.ADMIN_SETTINGS}>ການຕັ້ງຄ່າ</Link>,
  },
];

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  // Find selected key based on current pathname
  const selectedKey = menuItems.find((item) =>
    pathname.startsWith(item?.key as string)
  )?.key as string || ROUTES.ADMIN_DASHBOARD;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      className="fixed left-0 top-0 z-50 h-screen"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <Link href={ROUTES.ADMIN_DASHBOARD} className="text-white">
          <span className="text-lg font-bold">
            {collapsed ? 'FS' : APP_NAME}
          </span>
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="mt-2"
      />
    </Sider>
  );
}
