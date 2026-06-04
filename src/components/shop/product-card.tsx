'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Tag, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { ROUTES } from '@/constants';
import { addToCartAction } from '@/actions/cart.actions';
import { WishlistButton } from './wishlist-button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string | null;
    thumbnail: string | null;
    price: number;
    salePrice: number | null;
    stockQuantity: number;
    minStockLevel: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    images?: { url: string }[];
  };
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const imageUrl = product.thumbnail || product.images?.[0]?.url;
  const hasDiscount =
    product.salePrice && Number(product.salePrice) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice)) /
          Number(product.price)) *
          100
      )
    : 0;

  const getStockStatus = () => {
    if (product.stockQuantity === 0) return 'OUT_OF_STOCK';
    if (product.stockQuantity <= product.minStockLevel) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = stockStatus === 'OUT_OF_STOCK';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await addToCartAction(product.id, 1);
    if (result.success) {
      message.success(result.message);
      // Update cart indicator
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } else {
      message.error(result.error);
    }
  };

  return (
    <Link href={ROUTES.SHOP_PRODUCT(product.slug || product.id)}>
      <Card
        hoverable
        className="h-full overflow-hidden"
        cover={
          <div className="relative aspect-square bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            {hasDiscount && (
              <Tag color="red" className="absolute left-2 top-2">
                -{discountPercent}%
              </Tag>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Tag color="default" className="text-lg">
                  ໝົດສິນຄ້າ
                </Tag>
              </div>
            )}
            <div className="absolute right-2 top-2">
              <WishlistButton productId={product.id} size="small" />
            </div>
          </div>
        }
        styles={{ body: { padding: '12px' } }}
      >
        <div className="space-y-2">
          {product.category && (
            <p className="text-xs text-gray-500">{product.category.name}</p>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-red-500">
                    {Number(product.salePrice).toLocaleString()} ₭
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {Number(product.price).toLocaleString()} ₭
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold">
                  {Number(product.price).toLocaleString()} ₭
                </span>
              )}
            </div>
          </div>
          {showAddToCart && (
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              block
              className="mt-2"
            >
              {isOutOfStock ? 'ໝົດສິນຄ້າ' : 'ເພີ່ມໃສ່ກະຕ່າ'}
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}
