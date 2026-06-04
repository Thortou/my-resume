'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Table, Tag, Button, Empty, Spin, message, Modal } from 'antd';
import {
  EyeOutlined,
  ShoppingOutlined,
  CloseCircleOutlined,
  RightOutlined,
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

  // Table columns for desktop
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
      render: (_: unknown, record: Order) => `${record._count.items} ລາຍການ`,
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
      render: (_: unknown, record: Order) => (
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

  // Compact Mobile Order Card
  const CompactOrderCard = ({ order }: { order: Order }) => (
    <Link
      href={ROUTES.ORDER_DETAIL(order.id)}
      className="block rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">#{order.orderNumber}</span>
            <Tag color={ORDER_STATUS_COLORS[order.status]} className="m-0">
              {ORDER_STATUS_LABELS[order.status]}
            </Tag>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('lo-LA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {' · '}
            {order._count.items} ລາຍການ
          </p>
          <p className="mt-1 font-semibold text-primary-600">
            {Number(order.total).toLocaleString()} ₭
          </p>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>
      {order.status === 'PENDING' && (
        <div className="mt-3 border-t pt-3">
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCancel(order.id);
            }}
            loading={cancelling === order.id}
          >
            ຍົກເລີກຄຳສັ່ງຊື້
          </Button>
        </div>
      )}
    </Link>
  );

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">
        ປະຫວັດການສັ່ງຊື້
      </h1>

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
        <>
          {/* Mobile View - Card Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order) => (
              <CompactOrderCard key={order.id} order={order} />
            ))}

            {/* Mobile Pagination */}
            {pagination.total > pagination.pageSize && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {pagination.current} /{' '}
                  {Math.ceil(pagination.total / pagination.pageSize)} ໜ້າ
                </span>
                <div className="flex gap-2">
                  <Button
                    disabled={pagination.current <= 1}
                    onClick={() => fetchOrders(pagination.current - 1)}
                  >
                    ກ່ອນໜ້າ
                  </Button>
                  <Button
                    disabled={
                      pagination.current >=
                      Math.ceil(pagination.total / pagination.pageSize)
                    }
                    onClick={() => fetchOrders(pagination.current + 1)}
                  >
                    ຕໍ່ໄປ
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop View - Table Layout */}
          <Card className="hidden md:block">
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showTotal: (total) => `ທັງໝົດ ${total} ຄຳສັ່ງຊື້`,
                showSizeChanger: false,
              }}
              onChange={(p) => fetchOrders(p.current)}
            />
          </Card>
        </>
      )}
    </div>
  );
}
