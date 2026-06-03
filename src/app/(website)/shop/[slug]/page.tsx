import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Row, Col, Card, Tag, Rate, Breadcrumb, Divider, Spin } from 'antd';
import { HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { ROUTES, STOCK_STATUS_LABELS } from '@/constants';
import { ProductCard } from '@/components/shop/product-card';
import { AddToCartButton } from '@/components/shop/add-to-cart-button';
import { WishlistButton } from '@/components/shop/wishlist-button';
import {
  getProductBySlugAction,
  getRelatedProductsAction,
} from '@/actions/product.actions';

// Helper to serialize product data (convert Decimal to number)
function serializeProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    return { title: 'ບໍ່ພົບສິນຄ້າ' };
  }

  return {
    title: product.name,
    description:
      product.shortDescription || product.description?.substring(0, 160),
  };
}

async function RelatedProducts({
  productId,
  categoryId,
}: {
  productId: string;
  categoryId: string;
}) {
  const products = await getRelatedProductsAction(productId, categoryId, 4);

  if (!products || products.length === 0) return null;

  const serializedProducts = serializeProducts(products);

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-xl font-bold">ສິນຄ້າທີ່ກ່ຽວຂ້ອງ</h2>
      <Row gutter={[16, 16]}>
        {serializedProducts.map((product) => (
          <Col key={product.id} xs={12} sm={8} md={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    product.salePrice && Number(product.salePrice) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.salePrice!)) /
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

  // Get all images
  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []),
  ];

  // Calculate average rating
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-6"
        items={[
          {
            href: ROUTES.HOME,
            title: (
              <>
                <HomeOutlined />
                <span>ໜ້າຫຼັກ</span>
              </>
            ),
          },
          {
            href: ROUTES.SHOP,
            title: (
              <>
                <ShopOutlined />
                <span>ຮ້ານຄ້າ</span>
              </>
            ),
          },
          {
            title: product.name,
          },
        ]}
      />

      <Row gutter={[32, 32]}>
        {/* Images */}
        <Col xs={24} md={12}>
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {allImages.length > 0 ? (
                <Image
                  src={allImages[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {hasDiscount && (
                <Tag color="red" className="absolute left-4 top-4 text-lg">
                  -{discountPercent}%
                </Tag>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded bg-gray-100"
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Details */}
        <Col xs={24} md={12}>
          <div className="space-y-4">
            {/* Category */}
            {product.category && (
              <Link
                href={`${ROUTES.SHOP}?category=${product.category.id}`}
                className="text-sm text-gray-500 hover:text-primary-500"
              >
                {product.category.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

            {/* Rating */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Rate disabled defaultValue={avgRating} allowHalf />
                <span className="text-gray-500">
                  ({product.reviews.length} ຣີວິວ)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-red-500">
                    {Number(product.salePrice).toLocaleString()} ₭
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {Number(product.price).toLocaleString()} ₭
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {Number(product.price).toLocaleString()} ₭
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              <Tag
                color={
                  stockStatus === 'IN_STOCK'
                    ? 'green'
                    : stockStatus === 'LOW_STOCK'
                      ? 'orange'
                      : 'red'
                }
              >
                {
                  STOCK_STATUS_LABELS[
                    stockStatus as keyof typeof STOCK_STATUS_LABELS
                  ]
                }
              </Tag>
              {stockStatus !== 'OUT_OF_STOCK' && (
                <span className="ml-2 text-sm text-gray-500">
                  ({product.stockQuantity} ໜ່ວຍ)
                </span>
              )}
            </div>

            <Divider />

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600">{product.shortDescription}</p>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <AddToCartButton
                productId={product.id}
                disabled={isOutOfStock}
                maxQuantity={product.stockQuantity}
              />
              <WishlistButton
                productId={product.id}
                showText
                size="large"
                className="w-full"
              />
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-gray-500">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>
            )}
          </div>
        </Col>
      </Row>

      {/* Description */}
      {product.description && (
        <Card className="mt-8" title="ລາຍລະອຽດສິນຄ້າ">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </Card>
      )}

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <Card
          className="mt-8"
          title={`ຣີວິວລູກຄ້າ (${product.reviews.length})`}
        >
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="mb-2 flex items-center gap-3">
                  <span className="font-medium">
                    {review.user?.name || 'ບໍ່ລະບຸຊື່'}
                  </span>
                  <Rate
                    disabled
                    defaultValue={review.rating}
                    className="text-sm"
                  />
                </div>
                {review.comment && (
                  <p className="text-gray-600">{review.comment}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('lo-LA')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Related Products */}
      {product.categoryId && (
        <Suspense
          fallback={
            <div className="mt-12 flex justify-center py-8">
              <Spin />
            </div>
          }
        >
          <RelatedProducts
            productId={product.id}
            categoryId={product.categoryId}
          />
        </Suspense>
      )}
    </div>
  );
}
