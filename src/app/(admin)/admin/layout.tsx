'use client';

import { useState } from 'react';
import { Layout } from 'antd';
import { AdminSidebar, AdminHeader } from '@/components/admin';

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="admin-layout min-h-screen">
      <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
        }}
      >
        <AdminHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <Content className="m-6 min-h-[calc(100vh-64px-48px)]">
          <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
