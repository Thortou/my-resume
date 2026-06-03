'use client';

import Link from 'next/link';
import { Card, Table, Tag, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { ROUTES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  user?: {
    name: string | null;
  };
  _count?: {
    items: number;
  };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const columns = [
    {
      title: 'ເລກທີ່ຄຳສັ່ງ',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <Link
          href={ROUTES.ADMIN_ORDER_DETAIL(record.id)}
          className="text-blue-500 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'ລູກຄ້າ',
      dataIndex: 'user',
      key: 'user',
      render: (user: Order['user']) => user?.name || 'Unknown',
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: '_count',
      key: 'items',
      render: (count: Order['_count']) => `${count?.items || 0} ລາຍການ`,
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${Number(total).toLocaleString()} ₭`,
    },
    {
      title: 'ສະຖານະ',
      dataIndex: 'status',
      key: 'status',
      render: (status: keyof typeof ORDER_STATUS_LABELS) => (
        <Tag color={ORDER_STATUS_COLORS[status]}>
          {ORDER_STATUS_LABELS[status]}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      title={
        <span>
          <ShoppingCartOutlined className="mr-2 text-blue-500" />
          ຄຳສັ່ງຊື້ຫຼ້າສຸດ
        </span>
      }
      extra={
        <Link href={ROUTES.ADMIN_ORDERS} className="text-blue-500">
          ເບິ່ງທັງໝົດ
        </Link>
      }
    >
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={false}
        size="small"
        locale={{ emptyText: <Empty description="ບໍ່ມີຄຳສັ່ງຊື້" /> }}
      />
    </Card>
  );
}
