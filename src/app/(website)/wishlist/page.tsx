'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Button, Empty, Spin, message, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { ROUTES } from '@/constants';
import {
  getWishlistAction,
  removeFromWishlistAction,
  clearWishlistAction,
} from '@/actions/wishlist.actions';
import { addToCartAction } from '@/actions/cart.actions';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string | null;
    price: number;
    salePrice: number | null;
    thumbnail: string | null;
    stockQuantity: number;
    isActive: boolean;
    category: {
      id: string;
      name: string;
    } | null;
  };
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const result = await getWishlistAction();
      setItems(result as WishlistItem[]);
    } catch (error) {
      message.error('ໂຫລດຂໍ້ມູນລົ້ມເຫລວ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      const result = await removeFromWishlistAction(productId);
      if (result.success) {
        message.success((result as { message?: string }).message || 'ສຳເລັດ');
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      } else {
        message.error((result as { error?: string }).error || 'ລຶບລົ້ມເຫລວ');
      }
    } catch (error) {
      message.error('ລຶບລົ້ມເຫລວ');
    } finally {
      setRemoving(null);
    }
  };

  // Clear wishlist
  const handleClear = async () => {
    try {
      const result = await clearWishlistAction();
      if (result.success) {
        message.success((result as { message?: string }).message || 'ສຳເລັດ');
        setItems([]);
      } else {
        message.error((result as { error?: string }).error || 'ລ້າງລົ້ມເຫລວ');
      }
    } catch (error) {
      message.error('ລ້າງລົ້ມເຫລວ');
    }
  };

  // Add to cart
  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      const result = await addToCartAction(productId, 1);
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.error);
      }
    } catch (error) {
      message.error('ເພີ່ມໃສ່ກະຕ່າລົ້ມເຫລວ');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Spin size="large" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="ລາຍການທີ່ມັກວ່າງ"
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartFilled className="text-2xl text-red-500" />
          <h1 className="text-2xl font-bold">
            ລາຍການທີ່ມັກ ({items.length} ລາຍການ)
          </h1>
        </div>
        <Popconfirm
          title="ລ້າງລາຍການທີ່ມັກ"
          description="ທ່ານຕ້ອງການລ້າງລາຍການທັງໝົດ?"
          onConfirm={handleClear}
          okText="ລ້າງ"
          cancelText="ຍົກເລີກ"
          okButtonProps={{ danger: true }}
        >
          <Button danger>ລ້າງທັງໝົດ</Button>
        </Popconfirm>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card
            key={item.id}
            hoverable
            cover={
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {item.product.thumbnail ? (
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    ບໍ່ມີຮູບ
                  </div>
                )}
                {!item.product.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded bg-red-500 px-2 py-1 text-sm text-white">
                      ບໍ່ພ້ອມໃຊ້ງານ
                    </span>
                  </div>
                )}
                {item.product.stockQuantity === 0 && item.product.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="rounded bg-orange-500 px-2 py-1 text-sm text-white">
                      ໝົດສິນຄ້າ
                    </span>
                  </div>
                )}
              </div>
            }
            actions={[
              <Button
                key="cart"
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => handleAddToCart(item.productId)}
                loading={addingToCart === item.productId}
                disabled={
                  !item.product.isActive || item.product.stockQuantity === 0
                }
              >
                ເພີ່ມໃສ່ກະຕ່າ
              </Button>,
              <Popconfirm
                key="delete"
                title="ລຶບອອກຈາກລາຍການທີ່ມັກ"
                description="ທ່ານຕ້ອງການລຶບສິນຄ້ານີ້?"
                onConfirm={() => handleRemove(item.productId)}
                okText="ລຶບ"
                cancelText="ຍົກເລີກ"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  loading={removing === item.productId}
                />
              </Popconfirm>,
            ]}
          >
            <Link
              href={ROUTES.SHOP_PRODUCT(item.product.slug || item.product.id)}
            >
              <Card.Meta
                title={
                  <span className="line-clamp-2 hover:text-primary-500">
                    {item.product.name}
                  </span>
                }
                description={
                  <div className="space-y-1">
                    {item.product.category && (
                      <p className="text-xs text-gray-500">
                        {item.product.category.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-500">
                        {item.product.price.toLocaleString()} ₭
                      </span>
                      {item.product.salePrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {item.product.salePrice.toLocaleString()} ₭
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      ສິນຄ້າເຫຼືອ: {item.product.stockQuantity} ອັນ
                    </p>
                  </div>
                }
              />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
