import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, Spin, Empty, Breadcrumb, Tag } from 'antd';
import { HomeOutlined, ShopOutlined } from '@ant-design/icons';
import { ROUTES } from '@/constants';
import { ProductCard } from '@/components/shop/product-card';
import {
  getShopProductsAction,
  getFeaturedProductsAction,
} from '@/actions/product.actions';
import { getActiveCategoriesAction } from '@/actions/category.actions';

export const metadata: Metadata = {
  title: 'ຮ້ານຄ້າ',
  description: 'ສິນຄ້າທັງໝົດຂອງພວກເຮົາ',
};

// Helper to serialize product data (convert Decimal to number)
function serializeProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

async function ProductGrid({
  searchParams,
}: {
  searchParams: ShopPageProps['searchParams'];
}) {
  const params = await searchParams;
  const result = await getShopProductsAction({
    categoryId: params.category,
    search: params.search,
    page: params.page ? parseInt(params.page) : 1,
    limit: 12,
    sortBy: params.sort || 'createdAt',
    sortOrder: 'desc',
  });

  if (result.data.length === 0) {
    return <Empty description="ບໍ່ພົບສິນຄ້າ" className="py-12" />;
  }

  const serializedProducts = serializeProducts(result.data);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {serializedProducts.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function CategoryList({
  selectedCategory,
}: {
  selectedCategory?: string;
}) {
  const categories = await getActiveCategoriesAction();

  return (
    <>
      {/* Mobile Categories - Horizontal Scroll */}
      <div className="mb-4 md:hidden">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          <Link href={ROUTES.SHOP}>
            <Tag
              color={!selectedCategory ? 'blue' : 'default'}
              className="whitespace-nowrap px-3 py-1"
            >
              ທັງໝົດ
            </Tag>
          </Link>
          {(categories as any[]).map((cat) => (
            <Link key={cat.id} href={`${ROUTES.SHOP}?category=${cat.id}`}>
              <Tag
                color={selectedCategory === cat.id ? 'blue' : 'default'}
                className="whitespace-nowrap px-3 py-1"
              >
                {cat.name}
              </Tag>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Categories - Sidebar */}
      <Card title="ໝວດໝູ່" size="small" className="hidden md:block">
        <div className="space-y-1">
          <Link
            href={ROUTES.SHOP}
            className={`block rounded px-3 py-2 text-sm transition ${
              !selectedCategory
                ? 'bg-primary-50 font-medium text-primary-600'
                : 'hover:bg-gray-50'
            }`}
          >
            ທັງໝົດ
          </Link>
          {(categories as any[]).map((cat) => (
            <Link
              key={cat.id}
              href={`${ROUTES.SHOP}?category=${cat.id}`}
              className={`block rounded px-3 py-2 text-sm transition ${
                selectedCategory === cat.id
                  ? 'bg-primary-50 font-medium text-primary-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </Card>
    </>
  );
}

async function FeaturedSection() {
  const products = await getFeaturedProductsAction(4);

  if (!products || products.length === 0) return null;

  const serializedProducts = serializeProducts(products);

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">ສິນຄ້າແນະນຳ</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {serializedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb - Hidden on mobile */}
      <Breadcrumb
        className="mb-4 hidden sm:mb-6 sm:block"
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
            title: (
              <>
                <ShopOutlined />
                <span>ຮ້ານຄ້າ</span>
              </>
            ),
          },
        ]}
      />

      {/* Page Title - Mobile */}
      <h1 className="mb-4 text-xl font-bold sm:hidden">
        {params.search ? `ຄົ້ນຫາ: "${params.search}"` : 'ຮ້ານຄ້າ'}
      </h1>

      {/* Featured Products */}
      {!params.category && !params.search && (
        <Suspense
          fallback={
            <div className="mb-6 sm:mb-8">
              <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">
                ສິນຄ້າແນະນຳ
              </h2>
              <div className="flex justify-center py-12">
                <Spin />
              </div>
            </div>
          }
        >
          <FeaturedSection />
        </Suspense>
      )}

      {/* Mobile Category Filter */}
      <Suspense
        fallback={
          <div className="mb-4 md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
        }
      >
        <div className="md:hidden">
          <CategoryList selectedCategory={params.category} />
        </div>
      </Suspense>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden w-56 flex-shrink-0 md:block">
          <div className="sticky top-20">
            <Suspense fallback={<Card loading className="h-48" />}>
              <CategoryList selectedCategory={params.category} />
            </Suspense>
          </div>
        </div>

        {/* Products */}
        <div className="min-w-0 flex-1">
          {/* Desktop Title */}
          <div className="mb-4 hidden items-center justify-between sm:flex">
            <h1 className="text-2xl font-bold">
              {params.search ? `ຄົ້ນຫາ: "${params.search}"` : 'ສິນຄ້າທັງໝົດ'}
            </h1>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <Spin size="large" />
              </div>
            }
          >
            <ProductGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
