'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
  HistoryOutlined,
  WarningOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/ui';
import { STOCK_STATUS_LABELS } from '@/constants';
import {
  getProductsAction,
  getProductStatsAction,
} from '@/actions/product.actions';
import { adjustStockAction, getStockLogsAction } from '@/actions/stock.actions';

interface Product {
  id: string;
  name: string;
  thumbnail: string | null;
  sku: string | null;
  stockQuantity: number;
  minStockLevel: number;
  category: {
    id: string;
    name: string;
  } | null;
}

interface StockLog {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RESERVED' | 'RELEASED';
  quantity: number;
  previousStock: number;
  newStock: number;
  notes: string | null;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    sku: string | null;
    thumbnail: string | null;
  };
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [logsPagination, setLogsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<
    'IN' | 'OUT' | 'ADJUSTMENT'
  >('IN');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [form] = Form.useForm();

  // Fetch products
  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const result = await getProductsAction({
        page,
        limit: pagination.pageSize,
        search: search || undefined,
        isActive: true,
      });
      setProducts(result.data as Product[]);
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

  // Fetch stock logs
  const fetchStockLogs = async (page = 1) => {
    setLogsLoading(true);
    try {
      const result = await getStockLogsAction({
        page,
        limit: logsPagination.pageSize,
      });
      setStockLogs(result.data as StockLog[]);
      setLogsPagination((prev) => ({
        ...prev,
        current: page,
        total: result.pagination.total,
      }));
    } catch (error) {
      message.error('ໂຫລດປະຫວັດລົ້ມເຫລວ');
    } finally {
      setLogsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const result = await getProductStatsAction();
      setStats(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStockLogs();
    fetchStats();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchProducts(1, value);
  };

  // Open adjustment modal
  const handleOpenAdjustment = (
    product: Product,
    type: 'IN' | 'OUT' | 'ADJUSTMENT'
  ) => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    form.resetFields();
    form.setFieldsValue({
      quantity: type === 'ADJUSTMENT' ? product.stockQuantity : 1,
    });
    setModalOpen(true);
  };

  // Handle stock adjustment
  const handleAdjustment = async (values: any) => {
    if (!selectedProduct) return;

    setSubmitting(true);
    try {
      const result = await adjustStockAction(
        selectedProduct.id,
        adjustmentType,
        values.quantity,
        values.notes
      );

      if (result.success) {
        message.success(result.message);
        setModalOpen(false);
        form.resetFields();
        fetchProducts(pagination.current, searchText);
        fetchStockLogs();
        fetchStats();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ປັບປຸງສິນຄ້າລົ້ມເຫລວ');
    } finally {
      setSubmitting(false);
    }
  };

  // Get stock status
  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) {
      return { status: 'OUT_OF_STOCK', color: 'red' };
    }
    if (product.stockQuantity <= product.minStockLevel) {
      return { status: 'LOW_STOCK', color: 'orange' };
    }
    return { status: 'IN_STOCK', color: 'green' };
  };

  // Product columns
  const productColumns: ColumnsType<Product> = [
    {
      title: 'ຮູບ',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 60,
      render: (thumbnail: string | null) => (
        <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Product"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'ສິນຄ້າ',
      key: 'name',
      render: (_: any, record: Product) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-sm text-gray-500">{record.sku || '-'}</p>
        </div>
      ),
    },
    {
      title: 'ໝວດໝູ່',
      key: 'category',
      render: (_: any, record: Product) => record.category?.name || '-',
    },
    {
      title: 'ສະຖານະ',
      key: 'status',
      render: (_: any, record: Product) => {
        const stockStatus = getStockStatus(record);
        return (
          <Tag color={stockStatus.color}>
            {
              STOCK_STATUS_LABELS[
                stockStatus.status as keyof typeof STOCK_STATUS_LABELS
              ]
            }
          </Tag>
        );
      },
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (qty: number, record: Product) => (
        <span
          className={
            qty <= record.minStockLevel ? 'font-medium text-red-500' : ''
          }
        >
          {qty} ໜ່ວຍ
        </span>
      ),
    },
    {
      title: 'ຕ່ຳສຸດ',
      dataIndex: 'minStockLevel',
      key: 'minStockLevel',
      render: (level: number) => `${level} ໜ່ວຍ`,
    },
    {
      title: 'ການດຳເນີນການ',
      key: 'actions',
      width: 200,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleOpenAdjustment(record, 'IN')}
          >
            ນຳເຂົ້າ
          </Button>
          <Button
            size="small"
            danger
            icon={<MinusOutlined />}
            onClick={() => handleOpenAdjustment(record, 'OUT')}
            disabled={record.stockQuantity === 0}
          >
            ນຳອອກ
          </Button>
        </Space>
      ),
    },
  ];

  // Stock log columns
  const logColumns: ColumnsType<StockLog> = [
    {
      title: 'ວັນທີ',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleString('lo-LA'),
    },
    {
      title: 'ສິນຄ້າ',
      key: 'product',
      render: (_: any, record: StockLog) => (
        <div className="flex items-center gap-2">
          {record.product?.thumbnail && (
            <Image
              src={record.product.thumbnail}
              alt=""
              width={32}
              height={32}
              className="rounded"
            />
          )}
          <div>
            <p className="font-medium">{record.product?.name}</p>
            <p className="text-sm text-gray-500">
              {record.product?.sku || '-'}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'ປະເພດ',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig: Record<string, { label: string; color: string }> = {
          IN: { label: 'ນຳເຂົ້າ', color: 'green' },
          OUT: { label: 'ນຳອອກ', color: 'red' },
          ADJUSTMENT: { label: 'ປັບປຸງ', color: 'blue' },
          RESERVED: { label: 'ຈອງ', color: 'orange' },
          RELEASED: { label: 'ປ່ອຍ', color: 'purple' },
        };
        const config = typeConfig[type] || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number, record: StockLog) => (
        <span
          className={
            record.type === 'IN' || record.type === 'RELEASED'
              ? 'text-green-600'
              : 'text-red-600'
          }
        >
          {record.type === 'IN' || record.type === 'RELEASED' ? '+' : '-'}
          {qty}
        </span>
      ),
    },
    {
      title: 'ກ່ອນ → ຫຼັງ',
      key: 'change',
      render: (_: any, record: StockLog) => (
        <span>
          {record.previousStock} → {record.newStock}
        </span>
      ),
    },
    {
      title: 'ໝາຍເຫດ',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string | null) => notes || '-',
    },
  ];

  return (
    <div>
      <PageHeader
        title="ຈັດການສິນຄ້າຄົງຄັງ"
        description="ຕິດຕາມ ແລະ ປັບປຸງສິນຄ້າຄົງຄັງ"
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າທັງໝົດ"
              value={stats?.total || 0}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ມີສິນຄ້າ"
              value={
                (stats?.total || 0) -
                (stats?.outOfStock || 0) -
                (stats?.lowStock || 0)
              }
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າໃກ້ໝົດ"
              value={stats?.lowStock || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ສິນຄ້າໝົດ"
              value={stats?.outOfStock || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'products',
            label: (
              <span>
                <InboxOutlined /> ສິນຄ້າ
              </span>
            ),
            children: (
              <>
                <div className="mb-4">
                  <Input
                    placeholder="ຄົ້ນຫາສິນຄ້າ..."
                    prefix={<SearchOutlined />}
                    className="max-w-xs"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                  />
                </div>
                <Table
                  columns={productColumns}
                  dataSource={products}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showTotal: (total) => `ທັງໝົດ ${total} ສິນຄ້າ`,
                  }}
                  onChange={(p) => fetchProducts(p.current, searchText)}
                  scroll={{ x: 800 }}
                />
              </>
            ),
          },
          {
            key: 'history',
            label: (
              <span>
                <HistoryOutlined /> ປະຫວັດການເຄື່ອນໄຫວ
              </span>
            ),
            children: (
              <Table
                columns={logColumns}
                dataSource={stockLogs}
                rowKey="id"
                loading={logsLoading}
                pagination={{
                  ...logsPagination,
                  showSizeChanger: true,
                  showTotal: (total) => `ທັງໝົດ ${total} ລາຍການ`,
                }}
                onChange={(p) => fetchStockLogs(p.current)}
                scroll={{ x: 900 }}
              />
            ),
          },
        ]}
      />

      {/* Adjustment Modal */}
      <Modal
        title={
          adjustmentType === 'IN'
            ? 'ນຳເຂົ້າສິນຄ້າ'
            : adjustmentType === 'OUT'
              ? 'ນຳອອກສິນຄ້າ'
              : 'ປັບປຸງສິນຄ້າ'
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        {selectedProduct && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <p className="font-medium">{selectedProduct.name}</p>
            <p className="text-sm text-gray-500">
              ປະຈຸບັນ: {selectedProduct.stockQuantity} ໜ່ວຍ
            </p>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleAdjustment}>
          <Form.Item
            name="quantity"
            label={adjustmentType === 'ADJUSTMENT' ? 'ຈຳນວນໃໝ່' : 'ຈຳນວນ'}
            rules={[{ required: true, message: 'ກະລຸນາໃສ່ຈຳນວນ' }]}
          >
            <InputNumber
              className="w-full"
              min={adjustmentType === 'ADJUSTMENT' ? 0 : 1}
              placeholder="ໃສ່ຈຳນວນ"
            />
          </Form.Item>
          <Form.Item name="notes" label="ໝາຍເຫດ">
            <Input.TextArea rows={3} placeholder="ໝາຍເຫດ (ບໍ່ບັງຄັບ)" />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={() => setModalOpen(false)}>ຍົກເລີກ</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                danger={adjustmentType === 'OUT'}
              >
                {adjustmentType === 'IN'
                  ? 'ນຳເຂົ້າ'
                  : adjustmentType === 'OUT'
                    ? 'ນຳອອກ'
                    : 'ບັນທຶກ'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
