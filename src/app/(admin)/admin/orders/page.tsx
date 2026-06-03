'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Select,
  DatePicker,
  message,
  Dropdown,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/ui';
import { ROUTES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants';
import {
  getOrdersAction,
  updateOrderStatusAction,
} from '@/actions/order.actions';
import type { OrderStatus } from '@prisma/client';

const { RangePicker } = DatePicker;

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    items: number;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch orders
  const fetchOrders = async (
    page = 1,
    search = '',
    status?: OrderStatus,
    dates?: [any, any] | null
  ) => {
    setLoading(true);
    try {
      const result = await getOrdersAction({
        page,
        limit: pagination.pageSize,
        search: search || undefined,
        status,
        startDate: dates?.[0]?.toDate(),
        endDate: dates?.[1]?.toDate(),
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

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchOrders(1, value, selectedStatus, dateRange);
  };

  // Handle filter change
  const handleFilterChange = (
    status?: OrderStatus,
    dates?: [any, any] | null
  ) => {
    setSelectedStatus(status);
    setDateRange(dates || null);
    fetchOrders(1, searchText, status, dates);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setUpdating(true);
    try {
      const result = await updateOrderStatusAction(selectedOrder.id, {
        status: newStatus,
      });

      if (result.success) {
        message.success(result.message);
        setStatusModalOpen(false);
        setSelectedOrder(null);
        setNewStatus(null);
        fetchOrders(pagination.current, searchText, selectedStatus, dateRange);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ອັບເດດສະຖານະລົ້ມເຫລວ');
    } finally {
      setUpdating(false);
    }
  };

  // Open status modal
  const openStatusModal = (order: Order, status: OrderStatus) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setStatusModalOpen(true);
  };

  // Table columns
  const columns: ColumnsType<Order> = [
    {
      title: 'ເລກທີ່',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <Link
          href={ROUTES.ADMIN_ORDER_DETAIL(record.id)}
          className="font-medium text-blue-500 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'ລູກຄ້າ',
      key: 'customer',
      render: (_: any, record: Order) => (
        <div>
          <p className="font-medium">{record.customerName}</p>
          <p className="text-sm text-gray-500">{record.customerEmail}</p>
        </div>
      ),
    },
    {
      title: 'ລາຍການ',
      key: 'items',
      render: (_: any, record: Order) => `${record._count.items} ລາຍການ`,
    },
    {
      title: 'ຍອດລວມ',
      key: 'total',
      render: (_: any, record: Order) => (
        <div>
          <p className="font-medium">
            {Number(record.total).toLocaleString()} ₭
          </p>
          {Number(record.discount) > 0 && (
            <p className="text-sm text-green-500">
              -{Number(record.discount).toLocaleString()} ₭
            </p>
          )}
        </div>
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
      title: 'ວັນທີ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) =>
        new Date(date).toLocaleDateString('lo-LA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: Order) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: (
                  <Link href={ROUTES.ADMIN_ORDER_DETAIL(record.id)}>
                    ເບິ່ງລາຍລະອຽດ
                  </Link>
                ),
              },
              { type: 'divider' },
              {
                key: 'processing',
                icon: <SyncOutlined />,
                label: 'ກຳລັງດຳເນີນການ',
                disabled: record.status !== 'PENDING',
                onClick: () => openStatusModal(record, 'PROCESSING'),
              },
              {
                key: 'complete',
                icon: <CheckCircleOutlined />,
                label: 'ສຳເລັດ',
                disabled:
                  record.status === 'COMPLETED' ||
                  record.status === 'CANCELLED',
                onClick: () => openStatusModal(record, 'COMPLETED'),
              },
              {
                key: 'cancel',
                icon: <CloseCircleOutlined />,
                label: 'ຍົກເລີກ',
                danger: true,
                disabled:
                  record.status === 'COMPLETED' ||
                  record.status === 'CANCELLED',
                onClick: () => openStatusModal(record, 'CANCELLED'),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="ຈັດການຄຳສັ່ງຊື້"
        description="ເບິ່ງ ແລະ ຈັດການຄຳສັ່ງຊື້ທັງໝົດ"
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="ຄົ້ນຫາຄຳສັ່ງຊື້..."
            prefix={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="ສະຖານະທັງໝົດ"
            className="w-40"
            allowClear
            value={selectedStatus}
            onChange={(value) => handleFilterChange(value, dateRange)}
            options={Object.entries(ORDER_STATUS_LABELS).map(
              ([key, label]) => ({
                label,
                value: key,
              })
            )}
          />
          <RangePicker
            placeholder={['ເລີ່ມ', 'ສິ້ນສຸດ']}
            onChange={(dates) =>
              handleFilterChange(selectedStatus, dates as [any, any])
            }
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `ທັງໝົດ ${total} ຄຳສັ່ງຊື້`,
        }}
        onChange={(p) =>
          fetchOrders(p.current, searchText, selectedStatus, dateRange)
        }
        scroll={{ x: 900 }}
      />

      {/* Status Update Modal */}
      <Modal
        title="ຢືນຢັນການອັບເດດສະຖານະ"
        open={statusModalOpen}
        onCancel={() => {
          setStatusModalOpen(false);
          setSelectedOrder(null);
          setNewStatus(null);
        }}
        onOk={handleStatusUpdate}
        okText="ຢືນຢັນ"
        cancelText="ຍົກເລີກ"
        confirmLoading={updating}
        okButtonProps={{
          danger: newStatus === 'CANCELLED',
        }}
      >
        {selectedOrder && newStatus && (
          <div>
            <p>
              ທ່ານຕ້ອງການປ່ຽນສະຖານະຄຳສັ່ງຊື້{' '}
              <strong>{selectedOrder.orderNumber}</strong> ເປັນ
            </p>
            <Tag color={ORDER_STATUS_COLORS[newStatus]} className="mt-2">
              {ORDER_STATUS_LABELS[newStatus]}
            </Tag>
            {newStatus === 'CANCELLED' && (
              <p className="mt-3 text-red-500">
                ຄຳເຕືອນ: ການຍົກເລີກຈະຄືນສິນຄ້າກັບໄປຄັງສິນຄ້າ
              </p>
            )}
            {newStatus === 'COMPLETED' && (
              <p className="mt-3 text-green-500">
                ໝາຍເຫດ: ສິນຄ້າຈະຖືກຫັກອອກຈາກຄັງສິນຄ້າຖາວອນ
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
