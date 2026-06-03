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
  Switch,
  InputNumber,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/ui';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/category.actions';
import { uploadImageAction } from '@/actions/upload.actions';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch categories
  const fetchCategories = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const result = await getCategoriesAction({
        page,
        limit: pagination.pageSize,
        search: search || undefined,
      });
      setCategories(result.data as Category[]);
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
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchCategories(1, value);
  };

  // Handle table change
  const handleTableChange = (paginationConfig: any) => {
    fetchCategories(paginationConfig.current, searchText);
  };

  // Open modal for create
  const handleCreate = () => {
    setEditingCategory(null);
    setImageUrl(null);
    form.resetFields();
    form.setFieldsValue({ sortOrder: 0, isActive: true });
    setModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setImageUrl(record.image);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      sortOrder: record.sortOrder,
      isActive: record.isActive,
    });
    setModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        message.success(result.message);
        fetchCategories(pagination.current, searchText);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ລຶບລົ້ມເຫລວ');
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImageAction(
        base64,
        'full-stack-starter/categories'
      );
      if (result.success && result.data) {
        setImageUrl(result.data.url);
        message.success('ອັບໂຫລດຮູບສຳເລັດ');
      } else {
        message.error(result.error || 'ອັບໂຫລດລົ້ມເຫລວ');
      }
    } catch {
      message.error('ອັບໂຫລດລົ້ມເຫລວ');
    } finally {
      setUploadLoading(false);
    }
    return false;
  };

  // Handle form submit
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const data = {
        ...values,
        image: imageUrl,
      };

      let result;
      if (editingCategory) {
        result = await updateCategoryAction(editingCategory.id, data);
      } else {
        result = await createCategoryAction(data);
      }

      if (result.success) {
        message.success(result.message);
        setModalOpen(false);
        form.resetFields();
        setImageUrl(null);
        fetchCategories(pagination.current, searchText);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ບັນທຶກລົ້ມເຫລວ');
    } finally {
      setSubmitting(false);
    }
  };

  // Table columns
  const columns: ColumnsType<Category> = [
    {
      title: 'ຮູບ',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string | null) => (
        <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt="Category"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'ຊື່ໝວດໝູ່',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => (
        <code className="rounded bg-gray-100 px-2 py-1 text-sm">{slug}</code>
      ),
    },
    {
      title: 'ສິນຄ້າ',
      key: 'products',
      width: 100,
      render: (_: any, record: Category) => (
        <Tag color="blue">{record._count.products} ລາຍການ</Tag>
      ),
    },
    {
      title: 'ລຳດັບ',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: true,
    },
    {
      title: 'ສະຖານະ',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
        </Tag>
      ),
    },
    {
      title: 'ການດຳເນີນການ',
      key: 'actions',
      width: 120,
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="ຢືນຢັນການລຶບ"
            description="ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ນີ້?"
            onConfirm={() => handleDelete(record.id)}
            okText="ລຶບ"
            cancelText="ຍົກເລີກ"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              disabled={record._count.products > 0}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="ຈັດການໝວດໝູ່"
        description="ສ້າງ ແລະ ຈັດການໝວດໝູ່ສິນຄ້າ"
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="ຄົ້ນຫາໝວດໝູ່..."
          prefix={<SearchOutlined />}
          className="max-w-xs"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          ເພີ່ມໝວດໝູ່
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `ທັງໝົດ ${total} ລາຍການ`,
        }}
        onChange={handleTableChange}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingCategory ? 'ແກ້ໄຂໝວດໝູ່' : 'ເພີ່ມໝວດໝູ່ໃໝ່'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setImageUrl(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="ຊື່ໝວດໝູ່"
            rules={[{ required: true, message: 'ກະລຸນາໃສ່ຊື່ໝວດໝູ່' }]}
          >
            <Input placeholder="ໃສ່ຊື່ໝວດໝູ່" />
          </Form.Item>

          <Form.Item name="description" label="ຄຳອະທິບາຍ">
            <Input.TextArea rows={3} placeholder="ຄຳອະທິບາຍໝວດໝູ່" />
          </Form.Item>

          <Form.Item label="ຮູບພາບ">
            <div className="flex items-center gap-4">
              {imageUrl && (
                <div className="h-20 w-20 overflow-hidden rounded bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt="Category"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} loading={uploadLoading}>
                  {imageUrl ? 'ປ່ຽນຮູບ' : 'ອັບໂຫລດຮູບ'}
                </Button>
              </Upload>
              {imageUrl && (
                <Button danger onClick={() => setImageUrl(null)}>
                  ລຶບຮູບ
                </Button>
              )}
            </div>
          </Form.Item>

          <Form.Item name="sortOrder" label="ລຳດັບການສະແດງ">
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="isActive" label="ສະຖານະ" valuePropName="checked">
            <Switch checkedChildren="ໃຊ້ງານ" unCheckedChildren="ປິດ" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={() => setModalOpen(false)}>ຍົກເລີກ</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingCategory ? 'ບັນທຶກ' : 'ສ້າງໝວດໝູ່'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
