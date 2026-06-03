'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  Table,
  Button,
  InputNumber,
  Empty,
  Spin,
  message,
  Popconfirm,
  Divider,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { ROUTES } from '@/constants';
import {
  getCartAction,
  updateCartItemAction,
  removeFromCartAction,
  clearCartAction,
} from '@/actions/cart.actions';

interface CartItem {
  id: string;
  quantity: number;
  price: number;
  itemTotal: number;
  isAvailable: boolean;
  stockQuantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    sku: string | null;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch cart
  const fetchCart = async () => {
    try {
      const result = await getCartAction();
      setCart(result);
    } catch (error) {
      message.error('ໂຫລດກະຕ່າລົ້ມເຫລວ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setUpdating(productId);
    try {
      const result = await updateCartItemAction(productId, quantity);
      if (result.success) {
        fetchCart();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ອັບເດດລົ້ມເຫລວ');
    } finally {
      setUpdating(null);
    }
  };

  // Remove item
  const handleRemove = async (productId: string) => {
    setUpdating(productId);
    try {
      const result = await removeFromCartAction(productId);
      if (result.success) {
        message.success(result.message);
        fetchCart();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ລຶບລົ້ມເຫລວ');
    } finally {
      setUpdating(null);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      const result = await clearCartAction();
      if (result.success) {
        message.success(result.message);
        fetchCart();
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ລ້າງກະຕ່າລົ້ມເຫລວ');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Spin size="large" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="ກະຕ່າຂອງທ່ານວ່າງ"
        >
          <Link href={ROUTES.SHOP}>
            <Button type="primary" icon={<ShoppingOutlined />}>
              ເລີ່ມຊ້ອບປິ້ງ
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const columns = [
    {
      title: 'ສິນຄ້າ',
      key: 'product',
      render: (_: any, record: CartItem) => (
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
            {record.product.thumbnail ? (
              <Image
                src={record.product.thumbnail}
                alt={record.product.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                No
              </div>
            )}
          </div>
          <div>
            <Link
              href={ROUTES.SHOP_PRODUCT(
                record.product.slug || record.product.id
              )}
              className="font-medium hover:text-primary-500"
            >
              {record.product.name}
            </Link>
            {record.product.sku && (
              <p className="text-sm text-gray-500">SKU: {record.product.sku}</p>
            )}
            {!record.isAvailable && (
              <p className="text-sm text-red-500">ສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພຽງພໍ</p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'ລາຄາ',
      key: 'price',
      width: 150,
      render: (_: any, record: CartItem) => (
        <span>{record.price.toLocaleString()} ₭</span>
      ),
    },
    {
      title: 'ຈຳນວນ',
      key: 'quantity',
      width: 150,
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          max={record.stockQuantity}
          value={record.quantity}
          onChange={(value) =>
            handleUpdateQuantity(record.product.id, value || 1)
          }
          disabled={updating === record.product.id || !record.isAvailable}
        />
      ),
    },
    {
      title: 'ລວມ',
      key: 'total',
      width: 150,
      render: (_: any, record: CartItem) => (
        <span className="font-medium">
          {record.itemTotal.toLocaleString()} ₭
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: any, record: CartItem) => (
        <Popconfirm
          title="ຢືນຢັນການລຶບ"
          description="ທ່ານຕ້ອງການລຶບສິນຄ້ານີ້ອອກຈາກກະຕ່າ?"
          onConfirm={() => handleRemove(record.product.id)}
          okText="ລຶບ"
          cancelText="ຍົກເລີກ"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={updating === record.product.id}
          />
        </Popconfirm>
      ),
    },
  ];

  const hasUnavailableItems = cart.items.some((item) => !item.isAvailable);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          ກະຕ່າສິນຄ້າ ({cart.itemCount} ລາຍການ)
        </h1>
        <Popconfirm
          title="ລ້າງກະຕ່າ"
          description="ທ່ານຕ້ອງການລ້າງສິນຄ້າທັງໝົດອອກຈາກກະຕ່າ?"
          onConfirm={handleClearCart}
          okText="ລ້າງ"
          cancelText="ຍົກເລີກ"
          okButtonProps={{ danger: true }}
        >
          <Button danger>ລ້າງກະຕ່າ</Button>
        </Popconfirm>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Table
              columns={columns}
              dataSource={cart.items}
              rowKey="id"
              pagination={false}
              scroll={{ x: 600 }}
            />
          </Card>
        </div>

        <div>
          <Card title="ສະຫຼຸບຄຳສັ່ງຊື້">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>ລວມຍ່ອຍ</span>
                <span>{cart.subtotal.toLocaleString()} ₭</span>
              </div>
              <div className="flex justify-between">
                <span>ຄ່າສົ່ງ</span>
                <span className="text-green-500">ຟຣີ</span>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>ລວມທັງໝົດ</span>
                <span>{cart.subtotal.toLocaleString()} ₭</span>
              </div>
            </div>

            {hasUnavailableItems && (
              <p className="mt-4 text-sm text-red-500">
                * ບາງສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພຽງພໍ. ກະລຸນາລຶບອອກກ່ອນຊຳລະ.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Link href={ROUTES.CHECKOUT}>
                <Button
                  type="primary"
                  size="large"
                  block
                  disabled={hasUnavailableItems}
                >
                  ດຳເນີນການຊຳລະ
                </Button>
              </Link>
              <Link href={ROUTES.SHOP}>
                <Button size="large" block icon={<ArrowLeftOutlined />}>
                  ຊ້ອບປິ້ງຕໍ່
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
