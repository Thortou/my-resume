'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
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
  MinusOutlined,
  PlusOutlined,
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
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch cart
  const fetchCart = async () => {
    try {
      const result = await getCartAction();
      setCart(result);
      // Dispatch event to update cart indicator in navbar
      window.dispatchEvent(new CustomEvent('cart-updated'));
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

  const hasUnavailableItems = cart.items.some((item) => !item.isAvailable);

  // Mobile Cart Item Component
  const MobileCartItem = ({ item }: { item: CartItem }) => (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {item.product.thumbnail ? (
            <Image
              src={item.product.thumbnail}
              alt={item.product.name}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col">
          <Link
            href={ROUTES.SHOP_PRODUCT(item.product.slug || item.product.id)}
            className="font-medium text-gray-900 hover:text-primary-500"
          >
            {item.product.name}
          </Link>
          {item.product.sku && (
            <span className="text-xs text-gray-500">
              SKU: {item.product.sku}
            </span>
          )}
          <span className="mt-1 text-sm text-gray-600">
            {item.price.toLocaleString()} ₭
          </span>
          {!item.isAvailable && (
            <span className="text-xs text-red-500">
              ສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພຽງພໍ
            </span>
          )}
        </div>

        {/* Delete Button */}
        <Popconfirm
          title="ຢືນຢັນການລຶບ"
          description="ລຶບສິນຄ້ານີ້ອອກຈາກກະຕ່າ?"
          onConfirm={() => handleRemove(item.product.id)}
          okText="ລຶບ"
          cancelText="ຍົກເລີກ"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={updating === item.product.id}
            className="flex-shrink-0"
          />
        </Popconfirm>
      </div>

      {/* Quantity and Total */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() =>
              handleUpdateQuantity(
                item.product.id,
                Math.max(1, item.quantity - 1)
              )
            }
            disabled={
              item.quantity <= 1 ||
              updating === item.product.id ||
              !item.isAvailable
            }
          />
          <InputNumber
            size="small"
            min={1}
            max={item.stockQuantity}
            value={item.quantity}
            onChange={(value) =>
              handleUpdateQuantity(item.product.id, value || 1)
            }
            disabled={updating === item.product.id || !item.isAvailable}
            className="w-14 text-center"
            controls={false}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              handleUpdateQuantity(
                item.product.id,
                Math.min(item.stockQuantity, item.quantity + 1)
              )
            }
            disabled={
              item.quantity >= item.stockQuantity ||
              updating === item.product.id ||
              !item.isAvailable
            }
          />
        </div>
        <span className="text-lg font-semibold text-primary-600">
          {item.itemTotal.toLocaleString()} ₭
        </span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">
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
          <Button danger size="small" className="self-start sm:self-auto">
            ລ້າງກະຕ່າ
          </Button>
        </Popconfirm>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Mobile View - Card Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {cart.items.map((item) => (
              <MobileCartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Desktop View - Table Layout */}
          <Card className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">ສິນຄ້າ</th>
                    <th className="pb-3 font-medium">ລາຄາ</th>
                    <th className="pb-3 font-medium">ຈຳນວນ</th>
                    <th className="pb-3 font-medium">ລວມ</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            {item.product.thumbnail ? (
                              <Image
                                src={item.product.thumbnail}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={ROUTES.SHOP_PRODUCT(
                                item.product.slug || item.product.id
                              )}
                              className="font-medium hover:text-primary-500"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.sku && (
                              <p className="text-sm text-gray-500">
                                SKU: {item.product.sku}
                              </p>
                            )}
                            {!item.isAvailable && (
                              <p className="text-sm text-red-500">
                                ສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພຽງພໍ
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span>{item.price.toLocaleString()} ₭</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            size="small"
                            icon={<MinusOutlined />}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updating === item.product.id ||
                              !item.isAvailable
                            }
                          />
                          <InputNumber
                            size="small"
                            min={1}
                            max={item.stockQuantity}
                            value={item.quantity}
                            onChange={(value) =>
                              handleUpdateQuantity(item.product.id, value || 1)
                            }
                            disabled={
                              updating === item.product.id || !item.isAvailable
                            }
                            className="w-14"
                            controls={false}
                          />
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                Math.min(item.stockQuantity, item.quantity + 1)
                              )
                            }
                            disabled={
                              item.quantity >= item.stockQuantity ||
                              updating === item.product.id ||
                              !item.isAvailable
                            }
                          />
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-medium">
                          {item.itemTotal.toLocaleString()} ₭
                        </span>
                      </td>
                      <td className="py-4">
                        <Popconfirm
                          title="ຢືນຢັນການລຶບ"
                          description="ທ່ານຕ້ອງການລຶບສິນຄ້ານີ້ອອກຈາກກະຕ່າ?"
                          onConfirm={() => handleRemove(item.product.id)}
                          okText="ລຶບ"
                          cancelText="ຍົກເລີກ"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            loading={updating === item.product.id}
                          />
                        </Popconfirm>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-20">
          <Card title="ສະຫຼຸບຄຳສັ່ງຊື້">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ລວມຍ່ອຍ</span>
                <span>{cart.subtotal.toLocaleString()} ₭</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ຄ່າສົ່ງ</span>
                <span className="text-green-500">ຟຣີ</span>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>ລວມທັງໝົດ</span>
                <span className="text-primary-600">
                  {cart.subtotal.toLocaleString()} ₭
                </span>
              </div>
            </div>

            {hasUnavailableItems && (
              <p className="mt-4 text-sm text-red-500">
                * ບາງສິນຄ້າບໍ່ມີ ຫຼື ບໍ່ພຽງພໍ. ກະລຸນາລຶບອອກກ່ອນຊຳລະ.
              </p>
            )}

            <div className="mt-6 space-y-3">
              <Link href={ROUTES.CHECKOUT} className="block">
                <Button
                  type="primary"
                  size="large"
                  block
                  disabled={hasUnavailableItems}
                >
                  ດຳເນີນການຊຳລະ
                </Button>
              </Link>
              <Link href={ROUTES.SHOP} className="block">
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
