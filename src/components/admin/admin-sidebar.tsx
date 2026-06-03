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
  AppstoreOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  TagOutlined,
  BarChartOutlined,
  BellOutlined,
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
    key: 'inventory',
    icon: <InboxOutlined />,
    label: 'ຈັດການສິນຄ້າ',
    children: [
      {
        key: ROUTES.ADMIN_CATEGORIES,
        icon: <AppstoreOutlined />,
        label: <Link href={ROUTES.ADMIN_CATEGORIES}>ໝວດໝູ່</Link>,
      },
      {
        key: ROUTES.ADMIN_PRODUCTS,
        icon: <ShoppingOutlined />,
        label: <Link href={ROUTES.ADMIN_PRODUCTS}>ສິນຄ້າ</Link>,
      },
      {
        key: ROUTES.ADMIN_STOCK,
        icon: <InboxOutlined />,
        label: <Link href={ROUTES.ADMIN_STOCK}>ສາງສິນຄ້າ</Link>,
      },
    ],
  },
  {
    key: 'sales',
    icon: <ShoppingCartOutlined />,
    label: 'ການຂາຍ',
    children: [
      {
        key: ROUTES.ADMIN_ORDERS,
        icon: <ShoppingCartOutlined />,
        label: <Link href={ROUTES.ADMIN_ORDERS}>ການສັ່ງຊື້</Link>,
      },
      {
        key: ROUTES.ADMIN_COUPONS,
        icon: <TagOutlined />,
        label: <Link href={ROUTES.ADMIN_COUPONS}>ຄູປ໋ອງ</Link>,
      },
    ],
  },
  {
    key: ROUTES.ADMIN_REPORTS,
    icon: <BarChartOutlined />,
    label: <Link href={ROUTES.ADMIN_REPORTS}>ລາຍງານ</Link>,
  },
  {
    key: 'divider1',
    type: 'divider',
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
    key: ROUTES.ADMIN_NOTIFICATIONS,
    icon: <BellOutlined />,
    label: <Link href={ROUTES.ADMIN_NOTIFICATIONS}>ແຈ້ງເຕືອນ</Link>,
  },
  {
    key: ROUTES.ADMIN_SETTINGS,
    icon: <SettingOutlined />,
    label: <Link href={ROUTES.ADMIN_SETTINGS}>ການຕັ້ງຄ່າ</Link>,
  },
];

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  // Find selected key and open keys based on current pathname
  const getSelectedKey = () => {
    // Check direct routes first
    if (pathname.startsWith(ROUTES.ADMIN_CATEGORIES))
      return ROUTES.ADMIN_CATEGORIES;
    if (pathname.startsWith(ROUTES.ADMIN_PRODUCTS))
      return ROUTES.ADMIN_PRODUCTS;
    if (pathname.startsWith(ROUTES.ADMIN_STOCK)) return ROUTES.ADMIN_STOCK;
    if (pathname.startsWith(ROUTES.ADMIN_ORDERS)) return ROUTES.ADMIN_ORDERS;
    if (pathname.startsWith(ROUTES.ADMIN_COUPONS)) return ROUTES.ADMIN_COUPONS;
    if (pathname.startsWith(ROUTES.ADMIN_REPORTS)) return ROUTES.ADMIN_REPORTS;
    if (pathname.startsWith(ROUTES.ADMIN_USERS)) return ROUTES.ADMIN_USERS;
    if (pathname.startsWith(ROUTES.ADMIN_BANNERS)) return ROUTES.ADMIN_BANNERS;
    if (pathname.startsWith(ROUTES.ADMIN_NOTIFICATIONS))
      return ROUTES.ADMIN_NOTIFICATIONS;
    if (pathname.startsWith(ROUTES.ADMIN_SETTINGS))
      return ROUTES.ADMIN_SETTINGS;
    return ROUTES.ADMIN_DASHBOARD;
  };

  const getOpenKeys = () => {
    if (
      pathname.startsWith(ROUTES.ADMIN_CATEGORIES) ||
      pathname.startsWith(ROUTES.ADMIN_PRODUCTS) ||
      pathname.startsWith(ROUTES.ADMIN_STOCK)
    ) {
      return ['inventory'];
    }
    if (
      pathname.startsWith(ROUTES.ADMIN_ORDERS) ||
      pathname.startsWith(ROUTES.ADMIN_COUPONS)
    ) {
      return ['sales'];
    }
    return [];
  };

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
        background: '#ffffff',
      }}
    >
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <Link href={ROUTES.ADMIN_DASHBOARD} className="text-gray-800">
          <span className="text-lg font-bold">
            {collapsed ? 'FS' : APP_NAME}
          </span>
        </Link>
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        className="mt-2 border-r-0"
      />
    </Sider>
  );
}
