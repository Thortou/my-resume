'use client';

import { useState, useEffect } from 'react';
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
  Switch,
  DatePicker,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/ui';
import {
  getCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from '@/actions/coupon.actions';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  _count: {
    orders: number;
  };
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Fetch coupons
  const fetchCoupons = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const result = await getCouponsAction({
        page,
        limit: pagination.pageSize,
        search: search || undefined,
      });
      setCoupons(result.data as Coupon[]);
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
    fetchCoupons();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchCoupons(1, value);
  };

  // Handle create
  const handleCreate = () => {
    setEditingCoupon(null);
    form.resetFields();
    form.setFieldsValue({
      discountType: 'percentage',
      isActive: true,
    });
    setModalOpen(true);
  };

  // Handle edit
  const handleEdit = (record: Coupon) => {
    setEditingCoupon(record);
    form.setFieldsValue({
      code: record.code,
      description: record.description,
      discountType: record.discountType,
      discountValue: Number(record.discountValue),
      minOrderAmount: record.minOrderAmount
        ? Number(record.minOrderAmount)
        : null,
      maxDiscountAmount: record.maxDiscountAmount
        ? Number(record.maxDiscountAmount)
        : null,
      usageLimit: record.usageLimit,
      dateRange:
        record.startDate && record.endDate
          ? [dayjs(record.startDate), dayjs(record.endDate)]
          : null,
      isActive: record.isActive,
    });
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCouponAction(id);
      if (result.success) {
        message.success(result.message);
        fetchCoupons(pagination.current, searchText);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ລຶບລົ້ມເຫລວ');
    }
  };

  // Handle copy code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('ຄັດລອກລະຫັດແລ້ວ');
  };

  // Handle form submit
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        code: values.code,
        description: values.description,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount,
        maxDiscountAmount: values.maxDiscountAmount,
        usageLimit: values.usageLimit,
        startDate: values.dateRange?.[0]?.toDate() || null,
        endDate: values.dateRange?.[1]?.toDate() || null,
        isActive: values.isActive,
      };

      let result;
      if (editingCoupon) {
        result = await updateCouponAction(editingCoupon.id, data);
      } else {
        result = await createCouponAction(data);
      }

      if (result.success) {
        message.success(result.message);
        setModalOpen(false);
        form.resetFields();
        fetchCoupons(pagination.current, searchText);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ບັນທຶກລົ້ມເຫລວ');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if coupon is expired
  const isExpired = (coupon: Coupon) => {
    if (!coupon.endDate) return false;
    return new Date(coupon.endDate) < new Date();
  };

  // Check if coupon usage is exceeded
  const isExceeded = (coupon: Coupon) => {
    if (!coupon.usageLimit) return false;
    return coupon.usedCount >= coupon.usageLimit;
  };

  // Table columns
  const columns: ColumnsType<Coupon> = [
    {
      title: 'ລະຫັດ',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <div className="flex items-center gap-2">
          <code className="rounded bg-gray-100 px-2 py-1 font-mono">
            {code}
          </code>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyCode(code)}
          />
        </div>
      ),
    },
    {
      title: 'ສ່ວນຫຼຸດ',
      key: 'discount',
      render: (_: any, record: Coupon) => (
        <span className="font-medium">
          {record.discountType === 'percentage'
            ? `${Number(record.discountValue)}%`
            : `${Number(record.discountValue).toLocaleString()} ₭`}
        </span>
      ),
    },
    {
      title: 'ການໃຊ້ງານ',
      key: 'usage',
      render: (_: any, record: Coupon) => (
        <span>
          {record.usedCount} / {record.usageLimit || '∞'}
        </span>
      ),
    },
    {
      title: 'ໄລຍະເວລາ',
      key: 'period',
      render: (_: any, record: Coupon) => {
        if (!record.startDate && !record.endDate) return 'ບໍ່ຈຳກັດ';
        return (
          <span className="text-sm">
            {record.startDate
              ? new Date(record.startDate).toLocaleDateString('lo-LA')
              : '-'}
            {' ~ '}
            {record.endDate
              ? new Date(record.endDate).toLocaleDateString('lo-LA')
              : '-'}
          </span>
        );
      },
    },
    {
      title: 'ສະຖານະ',
      key: 'status',
      render: (_: any, record: Coupon) => {
        if (!record.isActive) {
          return <Tag color="default">ປິດໃຊ້ງານ</Tag>;
        }
        if (isExpired(record)) {
          return <Tag color="red">ໝົດອາຍຸ</Tag>;
        }
        if (isExceeded(record)) {
          return <Tag color="orange">ໃຊ້ຄົບແລ້ວ</Tag>;
        }
        return <Tag color="green">ໃຊ້ງານໄດ້</Tag>;
      },
    },
    {
      title: 'ການດຳເນີນການ',
      key: 'actions',
      width: 120,
      render: (_: any, record: Coupon) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="ຢືນຢັນການລຶບ"
            description="ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລະຫັດສ່ວນຫຼຸດນີ້?"
            onConfirm={() => handleDelete(record.id)}
            okText="ລຶບ"
            cancelText="ຍົກເລີກ"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              disabled={record._count.orders > 0}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="ຈັດການລະຫັດສ່ວນຫຼຸດ"
        description="ສ້າງ ແລະ ຈັດການລະຫັດສ່ວນຫຼຸດ"
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="ຄົ້ນຫາລະຫັດ..."
          prefix={<SearchOutlined />}
          className="max-w-xs"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          ເພີ່ມລະຫັດສ່ວນຫຼຸດ
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `ທັງໝົດ ${total} ລາຍການ`,
        }}
        onChange={(p) => fetchCoupons(p.current, searchText)}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingCoupon ? 'ແກ້ໄຂລະຫັດສ່ວນຫຼຸດ' : 'ເພີ່ມລະຫັດສ່ວນຫຼຸດໃໝ່'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="code"
            label="ລະຫັດ"
            rules={[{ required: true, message: 'ກະລຸນາໃສ່ລະຫັດ' }]}
          >
            <Input
              placeholder="ເຊັ່ນ: SALE20"
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>

          <Form.Item name="description" label="ຄຳອະທິບາຍ">
            <Input.TextArea rows={2} placeholder="ຄຳອະທິບາຍສ່ວນຫຼຸດ" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="discountType"
              label="ປະເພດສ່ວນຫຼຸດ"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: 'ເປີເຊັນ (%)', value: 'percentage' },
                  { label: 'ມູນຄ່າຄົງທີ່ (₭)', value: 'fixed' },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="discountValue"
              label="ມູນຄ່າ"
              rules={[{ required: true, message: 'ກະລຸນາໃສ່ມູນຄ່າ' }]}
            >
              <InputNumber className="w-full" min={0} placeholder="0" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="minOrderAmount" label="ຍອດສັ່ງຊື້ຕ່ຳສຸດ (₭)">
              <InputNumber
                className="w-full"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  Number(value!.replace(/,/g, '')) as unknown as 0
                }
                placeholder="0"
              />
            </Form.Item>
            <Form.Item name="maxDiscountAmount" label="ສ່ວນຫຼຸດສູງສຸດ (₭)">
              <InputNumber
                className="w-full"
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) =>
                  Number(value!.replace(/,/g, '')) as unknown as 0
                }
                placeholder="0"
              />
            </Form.Item>
          </div>

          <Form.Item name="usageLimit" label="ຈຳນວນການໃຊ້ງານ">
            <InputNumber className="w-full" min={1} placeholder="ບໍ່ຈຳກັດ" />
          </Form.Item>

          <Form.Item name="dateRange" label="ໄລຍະເວລາ">
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>

          <Form.Item name="isActive" label="ສະຖານະ" valuePropName="checked">
            <Switch checkedChildren="ໃຊ້ງານ" unCheckedChildren="ປິດ" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={() => setModalOpen(false)}>ຍົກເລີກ</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingCoupon ? 'ບັນທຶກ' : 'ສ້າງ'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
