'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Table, Tag, Button, Empty, Spin, message, Modal } from 'antd';
import {
  EyeOutlined,
  ShoppingOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ROUTES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants';
import {
  getUserOrdersAction,
  cancelOrderAction,
} from '@/actions/order.actions';
import type { OrderStatus } from '@prisma/client';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  _count: {
    items: number;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [cancelling, setCancelling] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getUserOrdersAction({
        page,
        limit: pagination.pageSize,
      });
      setOrders(result.data as Order[]);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('ໂຫລດຂໍ້ມູນລົ້ມເຫລວ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle cancel order
  const handleCancel = async (id: string) => {
    Modal.confirm({
      title: 'ຢືນຢັນການຍົກເລີກ',
      content: 'ທ່ານຕ້ອງການຍົກເລີກຄຳສັ່ງຊື້ນີ້ແທ້ບໍ?',
      okText: 'ຍົກເລີກຄຳສັ່ງຊື້',
      cancelText: 'ປິດ',
      okButtonProps: { danger: true },
      onOk: async () => {
        setCancelling(id);
        try {
          const result = await cancelOrderAction(id);
          if (result.success) {
            message.success(result.message);
            fetchOrders(pagination.current);
          } else {
            message.error(result.error);
          }
        } catch (error) {
          message.error('ຍົກເລີກລົ້ມເຫລວ');
        } finally {
          setCancelling(null);
        }
      },
    });
  };

  // Table columns
  const columns: ColumnsType<Order> = [
    {
      title: 'ເລກທີ່ຄຳສັ່ງຊື້',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <Link
          href={ROUTES.ORDER_DETAIL(record.id)}
          className="font-medium text-blue-500 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'ວັນທີ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) =>
        new Date(date).toLocaleDateString('lo-LA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      title: 'ລາຍການ',
      key: 'items',
      render: (_: any, record: Order) => `${record._count.items} ລາຍການ`,
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-medium">{Number(total).toLocaleString()} ₭</span>
      ),
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
    {
      title: '',
      key: 'actions',
      width: 150,
      render: (_: any, record: Order) => (
        <div className="flex gap-2">
          <Link href={ROUTES.ORDER_DETAIL(record.id)}>
            <Button type="text" icon={<EyeOutlined />}>
              ເບິ່ງ
            </Button>
          </Link>
          {record.status === 'PENDING' && (
            <Button
              type="text"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancel(record.id)}
              loading={cancelling === record.id}
            >
              ຍົກເລີກ
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ປະຫວັດການສັ່ງຊື້</h1>

      {orders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="ທ່ານຍັງບໍ່ມີຄຳສັ່ງຊື້"
        >
          <Link href={ROUTES.SHOP}>
            <Button type="primary" icon={<ShoppingOutlined />}>
              ເລີ່ມຊ້ອບປິ້ງ
            </Button>
          </Link>
        </Empty>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showTotal: (total) => `ທັງໝົດ ${total} ຄຳສັ່ງຊື້`,
            }}
            onChange={(p) => fetchOrders(p.current)}
            scroll={{ x: 700 }}
          />
        </Card>
      )}
    </div>
  );
}
