'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Select,
  message,
  Popconfirm,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '@/components/ui';
import { ROUTES, STOCK_STATUS_LABELS } from '@/constants';
import {
  getProductsAction,
  deleteProductAction,
} from '@/actions/product.actions';
import { getActiveCategoriesAction } from '@/actions/category.actions';

interface Product {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  minStockLevel: number;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  _count: {
    orderItems: number;
    reviews: number;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch products
  const fetchProducts = async (
    page = 1,
    search = '',
    categoryId?: string,
    isActive?: boolean
  ) => {
    setLoading(true);
    try {
      const result = await getProductsAction({
        page,
        limit: pagination.pageSize,
        search: search || undefined,
        categoryId,
        isActive,
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

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const result = await getActiveCategoriesAction();
      setCategories(result as Category[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchProducts(1, value, selectedCategory, selectedStatus);
  };

  // Handle filter change
  const handleFilterChange = (category?: string, status?: boolean) => {
    setSelectedCategory(category);
    setSelectedStatus(status);
    fetchProducts(1, searchText, category, status);
  };

  // Handle table change
  const handleTableChange = (paginationConfig: any) => {
    fetchProducts(
      paginationConfig.current,
      searchText,
      selectedCategory,
      selectedStatus
    );
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteProductAction(id);
      if (result.success) {
        message.success(result.message);
        fetchProducts(
          pagination.current,
          searchText,
          selectedCategory,
          selectedStatus
        );
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ລຶບລົ້ມເຫລວ');
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

  // Table columns
  const columns: ColumnsType<Product> = [
    {
      title: 'ຮູບ',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (thumbnail: string | null) => (
        <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt="Product"
              width={48}
              height={48}
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
      title: 'ຊື່ສິນຄ້າ',
      key: 'name',
      render: (_: any, record: Product) => (
        <div>
          <p className="font-medium">{record.name}</p>
          <p className="text-sm text-gray-500">{record.sku || 'ບໍ່ມີ SKU'}</p>
        </div>
      ),
    },
    {
      title: 'ໝວດໝູ່',
      key: 'category',
      render: (_: any, record: Product) => (
        <Tag>{record.category?.name || 'ບໍ່ມີໝວດໝູ່'}</Tag>
      ),
    },
    {
      title: 'ລາຄາ',
      key: 'price',
      render: (_: any, record: Product) => (
        <div>
          {record.salePrice ? (
            <>
              <p className="font-medium text-red-500">
                {Number(record.salePrice).toLocaleString()} ₭
              </p>
              <p className="text-sm text-gray-400 line-through">
                {Number(record.price).toLocaleString()} ₭
              </p>
            </>
          ) : (
            <p className="font-medium">
              {Number(record.price).toLocaleString()} ₭
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'ສິນຄ້າ',
      key: 'stock',
      render: (_: any, record: Product) => {
        const stockStatus = getStockStatus(record);
        return (
          <div>
            <Tag color={stockStatus.color}>
              {
                STOCK_STATUS_LABELS[
                  stockStatus.status as keyof typeof STOCK_STATUS_LABELS
                ]
              }
            </Tag>
            <p className="mt-1 text-sm text-gray-500">
              {record.stockQuantity} ໜ່ວຍ
            </p>
          </div>
        );
      },
    },
    {
      title: 'ສະຖານະ',
      key: 'status',
      width: 100,
      render: (_: any, record: Product) => (
        <Space direction="vertical" size="small">
          <Tag color={record.isActive ? 'green' : 'red'}>
            {record.isActive ? 'ໃຊ້ງານ' : 'ປິດ'}
          </Tag>
          {record.isFeatured && <Tag color="gold">ແນະນຳ</Tag>}
        </Space>
      ),
    },
    {
      title: 'ຂາຍ',
      key: 'sales',
      width: 80,
      render: (_: any, record: Product) => (
        <span>{record._count.orderItems} ຄັ້ງ</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: Product) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <EyeOutlined />,
                label: (
                  <Link href={ROUTES.SHOP_PRODUCT(record.slug || record.id)}>
                    ເບິ່ງ
                  </Link>
                ),
              },
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: (
                  <Link href={ROUTES.ADMIN_PRODUCT_EDIT(record.id)}>ແກ້ໄຂ</Link>
                ),
              },
              { type: 'divider' },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                danger: true,
                label: 'ລຶບ',
                disabled: record._count.orderItems > 0,
                onClick: () => handleDelete(record.id),
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
        title="ຈັດການສິນຄ້າ"
        description="ສ້າງ ແລະ ຈັດການສິນຄ້າທັງໝົດ"
      />

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="ຄົ້ນຫາສິນຄ້າ..."
            prefix={<SearchOutlined />}
            className="w-64"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
          <Select
            placeholder="ໝວດໝູ່ທັງໝົດ"
            className="w-40"
            allowClear
            value={selectedCategory}
            onChange={(value) => handleFilterChange(value, selectedStatus)}
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
          <Select
            placeholder="ສະຖານະ"
            className="w-32"
            allowClear
            value={selectedStatus}
            onChange={(value) => handleFilterChange(selectedCategory, value)}
            options={[
              { label: 'ໃຊ້ງານ', value: true },
              { label: 'ປິດໃຊ້ງານ', value: false },
            ]}
          />
        </div>
        <Link href={ROUTES.ADMIN_PRODUCT_NEW}>
          <Button type="primary" icon={<PlusOutlined />}>
            ເພີ່ມສິນຄ້າ
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `ທັງໝົດ ${total} ສິນຄ້າ`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}
